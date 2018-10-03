"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module count */
/** @hidden */
let os = require('os');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_components_node_1 = require("pip-services-components-node");
const pip_services_components_node_2 = require("pip-services-components-node");
const pip_services_rpc_node_1 = require("pip-services-rpc-node");
const PrometheusCounterConverter_1 = require("./PrometheusCounterConverter");
/**
 * Performance counters that send their metrics to Prometheus service.
 *
 * The component is normally used in passive mode conjunction with [[PrometheusMetricsService]].
 * Alternatively when connection parameters are set it can push metrics to Prometheus PushGateway.
 *
 * ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 * - options:
 *   - retries:               number of retries (default: 3)
 *   - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *   - timeout:               invocation timeout in milliseconds (default: 10 sec)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 *
 * @see [[https://rawgit.com/pip-services-node/pip-services-rpc-node/master/doc/api/classes/services.restservice.html RestService]]
 * @see [[https://rawgit.com/pip-services-node/pip-services-rpc-node/master/doc/api/classes/services.commandablehttpservice.html CommandableHttpService]]
 *
 * ### Example ###
 *
 *     let counters = new PrometheusCounters();
 *     counters.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *
 *     counters.open("123", (err) => {
 *         ...
 *     });
 *
 *     counters.increment("mycomponent.mymethod.calls");
 *     let timing = counters.beginTiming("mycomponent.mymethod.exec_time");
 *     try {
 *         ...
 *     } finally {
 *         timing.endTiming();
 *     }
 *
 *     counters.dump();
 */
class PrometheusCounters extends pip_services_components_node_1.CachedCounters {
    /**
     * Creates a new instance of the performance counters.
     */
    constructor() {
        super();
        this._logger = new pip_services_components_node_2.CompositeLogger();
        this._connectionResolver = new pip_services_rpc_node_1.HttpConnectionResolver();
        this._opened = false;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        super.configure(config);
        this._connectionResolver.configure(config);
        this._source = config.getAsStringWithDefault("source", this._source);
        this._instance = config.getAsStringWithDefault("instance", this._instance);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
        this._connectionResolver.setReferences(references);
        let contextInfo = references.getOneOptional(new pip_services_commons_node_1.Descriptor("pip-services", "context-info", "default", "*", "1.0"));
        if (contextInfo != null && this._source == null)
            this._source = contextInfo.name;
        if (contextInfo != null && this._instance == null)
            this._instance = contextInfo.contextId;
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._opened;
    }
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId, callback) {
        if (this._opened) {
            if (callback)
                callback(null);
            return;
        }
        this._opened = true;
        this._connectionResolver.resolve(correlationId, (err, connection) => {
            if (err) {
                this._client = null;
                this._logger.warn(correlationId, "Connection to Prometheus server is not configured: " + err);
                if (callback)
                    callback(null);
                return;
            }
            let job = this._source || "unknown";
            let instance = this._instance || os.hostname();
            this._requestRoute = "/metrics/job/" + job + "/instance/" + instance;
            let restify = require('restify');
            this._client = restify.createStringClient({ url: connection.getUri() });
            if (callback)
                callback(null);
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId, callback) {
        this._opened = false;
        this._client = null;
        this._requestRoute = null;
        if (callback)
            callback(null);
    }
    /**
     * Saves the current counters measurements.
     *
     * @param counters      current counters measurements to be saves.
     */
    save(counters) {
        if (this._client == null)
            return;
        let body = PrometheusCounterConverter_1.PrometheusCounterConverter.toString(counters, null, null);
        this._client.put(this._requestRoute, body, (err, req, res, data) => {
            if (err || res.statusCode >= 400)
                this._logger.error("prometheus-counters", err, "Failed to push metrics to prometheus");
        });
    }
}
exports.PrometheusCounters = PrometheusCounters;
//# sourceMappingURL=PrometheusCounters.js.map