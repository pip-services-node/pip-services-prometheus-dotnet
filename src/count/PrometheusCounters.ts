/** @module count */
/** @hidden */
let os = require('os');

import { ConfigParams } from 'pip-services-commons-node';
import { IReferenceable } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { IOpenable } from 'pip-services-commons-node';
import { CachedCounters } from 'pip-services-components-node';
import { Counter } from 'pip-services-components-node';
import { CompositeLogger } from 'pip-services-components-node';
import { ContextInfo } from 'pip-services-components-node';
import { HttpConnectionResolver } from 'pip-services-rpc-node';

import { PrometheusCounterConverter } from './PrometheusCounterConverter';

/**
 * CachedCounters implementation that allows usage of Prometheus, which supports 
 * multi-dimensional data collection and querying.
 * 
 * The Prometheus server is accessed using the connection URI (resolved by the 
 * connection resolver) and a request route (/metrics/job/<source>/instance/<instance>).
 * 
 * ### Configuration parameters ###
 * 
 * Parameters to pass to the [[configure]] method for component configuration:
 * 
 * - "source" - the name of the source from which data is being collected (e.g. job name);
 * - "instance" - the source instance's name/number;
 * - "interval" - the update interval, which is used to dump the cache to memory at 
 * regular intervals (default is 300000);
 * - "reset_timeout" - the timeout for resetting the cache (default is 0, which 
 * turn off resetting);
 * - __connection(s)__
 *     - "connection.discovery_key" - the key to use for connection resolving in a discovery service;
 *     - "connection.protocol" - the connection's protocol;
 *     - "connection.host" - the target host;
 *     - "connection.port" - the target port;
 *     - "connection.uri" - the target URI.
 * 
 * ### References ###
 * 
 * A logger, connection resolver, and a context can be referenced by passing the 
 * following references to the object's [[setReferences]] method:
 * 
 * - logger: <code>"\*:logger:\*:\*:1.0"</code>;
 * - connection resolver's discovery service: <code>"\*:discovery:\*:\*:1.0"</code>;
 * - context-info: <code>"\*:context-info:\*:\*:1.0"</code>.
 * 
 * @see [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/classes/count.cachedcounters.html CachedCounters]]
 */
export class PrometheusCounters extends CachedCounters implements IReferenceable, IOpenable {
    private _logger = new CompositeLogger();
    private _connectionResolver = new HttpConnectionResolver();
    private _opened: boolean = false;
    private _source: string;
    private _instance: string;
    private _client: any;
    private _requestRoute: string;

    /**
     * Creates a new PrometheusCounters object.
     */
    public constructor() { 
        super();
    }

    /**
     * Configures this component using the given configuration parameters.
     * 
     * __Configuration parameters:__
     * - "source" - the name of the source from which data is being collected (e.g. job name);
     * - "instance" - the source instance's name/number;
     * - "interval" - the update interval, which is used to dump the cache to memory at 
     * regular intervals (default is 300000);
     * - "reset_timeout" - the timeout for resetting the cache (default is 0, which 
     * turn off resetting);
     * - __connection(s)__
     *     - "connection.discovery_key" - the key to use for connection resolving in a discovery service;
     *     - "connection.protocol" - the connection's protocol;
     *     - "connection.host" - the target host;
     *     - "connection.port" - the target port;
     *     - "connection.uri" - the target URI.
     * 
     * @param config    the configuration parameters to configure this component with.
     * 
     * @see [[https://rawgit.com/pip-services-node/pip-services-commons-node/master/doc/api/classes/config.configparams.html ConfigParams]] (in the PipServices "Commons" package)
     */
    public configure(config: ConfigParams): void {
        super.configure(config);

        this._connectionResolver.configure(config);
        this._source = config.getAsStringWithDefault("source", this._source);
        this._instance = config.getAsStringWithDefault("instance", this._instance);
    }

    /**
     * Sets references to this component's logger, connection resolver, and context.
     * 
     * __References:__
     * - logger: <code>"\*:logger:\*:\*:1.0"</code>;
     * - connection resolver's discovery service: <code>"\*:discovery:\*:\*:1.0"</code>;
     * - context-info: <code>"\*:context-info:\*:\*:1.0"</code>.
     * 
     * If a "source" and/or "instance" were not given during component configuration, then 
     * the context-info's <code>name</code> and <code>contextID</code> will be used respectively.
     * 
     * @param references    an IReferences object, containing references to a logger, a context-info, 
     *                      and a discovery service.
     * 
     * @see [[https://rawgit.com/pip-services-node/pip-services-commons-node/master/doc/api/interfaces/refer.ireferences.html IReferences]] (in the PipServices "Commons" package)
     */
    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._connectionResolver.setReferences(references);

        let contextInfo = references.getOneOptional<ContextInfo>(
            new Descriptor("pip-services", "context-info", "default", "*", "1.0"));
        if (contextInfo != null && this._source == null)
            this._source = contextInfo.name;
        if (contextInfo != null && this._instance == null)
            this._instance = contextInfo.contextId;
    }

    /**
     * @returns     whether or not this component is currently open.
     */
    public isOpen(): boolean {
        return this._opened;
    }

    /**
     * Opens this component by connecting to the resolved Prometheus server 
     * and opening it as a REST-client. 
     *      
     * @param correlationId     unique business transaction id to trace calls across components.
     * @param callback          the function to call once the logger has been opened.
     *                          Will be called with an error, if one is raised.
     */
    public open(correlationId: string, callback: (err: any) => void): void {
        if (this._opened) {
            if (callback) callback(null);
            return;
        }

        this._opened = true;

        this._connectionResolver.resolve(correlationId, (err, connection) => {
            if (err) {
                this._client = null;
                this._logger.warn(correlationId, "Connection to Prometheus server is not configured: " + err);
                if (callback) callback(null);
                return;
            }

            let job = this._source || "unknown";
            let instance = this._instance || os.hostname();
            this._requestRoute = "/metrics/job/" + job + "/instance/" + instance;

            let restify = require('restify');
            this._client = restify.createStringClient({ url: connection.getUri() });

            if (callback) callback(null);
        });
    }

    /**
     * Closes this component and releases the client that was opened earlier.
     * 
     * @param correlationId     unique business transaction id to trace calls across components.
     * @param callback          the function to call once the component has been closed.
     *                          Will be called with an error, if one is raised.
     */
    public close(correlationId: string, callback: (err: any) => void): void {
        this._opened = false;
        this._client = null;
        this._requestRoute = null;

        if (callback) callback(null);
    }

    /**
     * Saves this objects counters by pushing their metrics to Prometheus.
     * 
     * @param counters  the counters to save.
     */
    protected save(counters: Counter[]): void {
        if (this._client == null) return;

        let body = PrometheusCounterConverter.toString(counters, null, null);

        this._client.put(this._requestRoute, body, (err, req, res, data) => {
            if (err || res.statusCode >= 400)
                this._logger.error("prometheus-counters", err, "Failed to push metrics to prometheus");
        });
    }
}