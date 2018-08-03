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

export class PrometheusCounters extends CachedCounters implements IReferenceable, IOpenable {
    private _logger = new CompositeLogger();
    private _connectionResolver = new HttpConnectionResolver();
    private _opened: boolean = false;
    private _source: string;
    private _instance: string;
    private _client: any;
    private _requestRoute: string;

    public constructor() { 
        super();
    }

    public configure(config: ConfigParams): void {
        super.configure(config);

        this._connectionResolver.configure(config);
        this._source = config.getAsStringWithDefault("source", this._source);
        this._instance = config.getAsStringWithDefault("instance", this._instance);
    }

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

    public isOpen(): boolean {
        return this._opened;
    }

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

    public close(correlationId: string, callback: (err: any) => void): void {
        this._opened = false;
        this._client = null;
        this._requestRoute = null;

        if (callback) callback(null);
    }

    protected save(counters: Counter[]): void {
        if (this._client == null) return;

        let body = PrometheusCounterConverter.toString(counters, null, null);

        this._client.put(this._requestRoute, body, (err, req, res, data) => {
            if (err || res.statusCode >= 400)
                this._logger.error("prometheus-counters", err, "Failed to push metrics to prometheus");
        });
    }
}