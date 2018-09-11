/** @module services */
import { Descriptor } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { RestService } from 'pip-services-rpc-node';

import { ContextInfo } from 'pip-services-components-node';
import { CachedCounters } from 'pip-services-components-node';

import { PrometheusCounters } from '../count/PrometheusCounters';
import { PrometheusCounterConverter } from '../count/PrometheusCounterConverter';

export class PrometheusMetricsService extends RestService {
    private _cachedCounters: CachedCounters;
    private _source: string;
    private _instance: string;

    public constructor() {
        super();
        this._dependencyResolver.put("cached-counters", new Descriptor("pip-services", "counters", "cached", "*", "1.0"));
        this._dependencyResolver.put("prometheus-counters", new Descriptor("pip-services", "counters", "prometheus", "*", "1.0"));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._cachedCounters = this._dependencyResolver.getOneOptional<PrometheusCounters>("prometheus-counters");
        if (this._cachedCounters == null)
            this._cachedCounters = this._dependencyResolver.getOneOptional<CachedCounters>("cached-counters");

        let contextInfo = references.getOneOptional<ContextInfo>(
            new Descriptor("pip-services", "context-info", "default", "*", "1.0"));
        if (contextInfo != null && this._source == "")
            this._source = contextInfo.name;
        if (contextInfo != null && this._instance == "")
            this._instance = contextInfo.contextId;
    }

    public register(): void {
        this.registerRoute("get", "metrics", null, (req, res) => { this.metrics(req, res); });
    }

    private metrics(req, res): void {
        let counters = this._cachedCounters != null ? this._cachedCounters.getAll() : null;
        let body = PrometheusCounterConverter.toString(counters, this._source, this._instance);

        res.setHeader('content-type', 'text/plain');
        res.statusCode = 200;
        res.end(body);
    }
}