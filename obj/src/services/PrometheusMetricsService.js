"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_rpc_node_1 = require("pip-services-rpc-node");
const PrometheusCounterConverter_1 = require("../count/PrometheusCounterConverter");
class PrometheusMetricsService extends pip_services_rpc_node_1.RestService {
    constructor() {
        super();
        this._dependencyResolver.put("cached-counters", new pip_services_commons_node_1.Descriptor("pip-services", "counters", "cached", "*", "1.0"));
        this._dependencyResolver.put("prometheus-counters", new pip_services_commons_node_1.Descriptor("pip-services", "counters", "prometheus", "*", "1.0"));
    }
    setReferences(references) {
        super.setReferences(references);
        this._cachedCounters = this._dependencyResolver.getOneOptional("prometheus-counters");
        if (this._cachedCounters == null)
            this._cachedCounters = this._dependencyResolver.getOneOptional("cached-counters");
        let contextInfo = references.getOneOptional(new pip_services_commons_node_1.Descriptor("pip-services", "context-info", "default", "*", "1.0"));
        if (contextInfo != null && this._source == "")
            this._source = contextInfo.name;
        if (contextInfo != null && this._instance == "")
            this._instance = contextInfo.contextId;
    }
    register() {
        this.registerRoute("get", "metrics", null, (req, res) => { this.metrics(req, res); });
    }
    metrics(req, res) {
        let counters = this._cachedCounters != null ? this._cachedCounters.getAll() : null;
        let body = PrometheusCounterConverter_1.PrometheusCounterConverter.toString(counters, this._source, this._instance);
        res.setHeader('content-type', 'text/plain');
        res.statusCode = 200;
        res.end(body);
    }
}
exports.PrometheusMetricsService = PrometheusMetricsService;
//# sourceMappingURL=PrometheusMetricsService.js.map