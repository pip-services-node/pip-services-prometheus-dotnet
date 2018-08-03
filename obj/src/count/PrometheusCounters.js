"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let os = require('os');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_components_node_1 = require("pip-services-components-node");
const pip_services_components_node_2 = require("pip-services-components-node");
const pip_services_rpc_node_1 = require("pip-services-rpc-node");
const PrometheusCounterConverter_1 = require("./PrometheusCounterConverter");
class PrometheusCounters extends pip_services_components_node_1.CachedCounters {
    constructor() {
        super();
        this._logger = new pip_services_components_node_2.CompositeLogger();
        this._connectionResolver = new pip_services_rpc_node_1.HttpConnectionResolver();
        this._opened = false;
    }
    configure(config) {
        super.configure(config);
        this._connectionResolver.configure(config);
        this._source = config.getAsStringWithDefault("source", this._source);
        this._instance = config.getAsStringWithDefault("instance", this._instance);
    }
    setReferences(references) {
        this._logger.setReferences(references);
        this._connectionResolver.setReferences(references);
        let contextInfo = references.getOneOptional(new pip_services_commons_node_1.Descriptor("pip-services", "context-info", "default", "*", "1.0"));
        if (contextInfo != null && this._source == null)
            this._source = contextInfo.name;
        if (contextInfo != null && this._instance == null)
            this._instance = contextInfo.contextId;
    }
    isOpen() {
        return this._opened;
    }
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
    close(correlationId, callback) {
        this._opened = false;
        this._client = null;
        this._requestRoute = null;
        if (callback)
            callback(null);
    }
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