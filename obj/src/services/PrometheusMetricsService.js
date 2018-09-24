"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module services */
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_rpc_node_1 = require("pip-services-rpc-node");
const PrometheusCounterConverter_1 = require("../count/PrometheusCounterConverter");
/**
 * Service that exposes "/metrics" route for Prometheus to scap performance metrics.
 *
 * ### Configuration parameters ###
 *
 * dependencies:
 *   endpoint:              override for HTTP Endpoint dependency
 *   prometheus-counters:   override for PrometheusCounters dependency
 * connection(s):
 *   discovery_key:         (optional) a key to retrieve the connection from IDiscovery
 *   protocol:              connection protocol: http or https
 *   host:                  host name or IP address
 *   port:                  port number
 *   uri:                   resource URI or connection string with all parameters in it
 *
 * ### References ###
 *
 * - *:logger:*:*:1.0               (optional) ILogger components to pass log messages
 * - *:counters:*:*:1.0             (optional) ICounters components to pass collected measurements
 * - *:discovery:*:*:1.0            (optional) IDiscovery services to resolve connection
 * - *:endpoint:http:*:1.0          (optional) HttpEndpoint reference to expose REST operation
 * - *:counters:prometheus:*:1.0    PrometheusCounters reference to retrieve collected metrics
 *
 * @see [[RestService]]
 * @see [[RestClient]]
 *
 * ### Example ###
 *
 * let service = new PrometheusMetricsService();
 * service.configure(ConfigParams.fromTuples(
 *     "connection.protocol", "http",
 *     "connection.host", "localhost",
 *     "connection.port", 8080
 * ));
 *
 * service.open("123", (err) => {
 *    console.log("The Prometheus metrics service is accessible at http://+:8080/metrics");
 * });
 */
class PrometheusMetricsService extends pip_services_rpc_node_1.RestService {
    /**
     * Creates a new instance of this service.
     */
    constructor() {
        super();
        this._dependencyResolver.put("cached-counters", new pip_services_commons_node_1.Descriptor("pip-services", "counters", "cached", "*", "1.0"));
        this._dependencyResolver.put("prometheus-counters", new pip_services_commons_node_1.Descriptor("pip-services", "counters", "prometheus", "*", "1.0"));
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
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
    /**
     * Registers all service routes in HTTP endpoint.
     */
    register() {
        this.registerRoute("get", "metrics", null, (req, res) => { this.metrics(req, res); });
    }
    /**
     * Handles metrics requests
     *
     * @param req   an HTTP request
     * @param res   an HTTP response
     */
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