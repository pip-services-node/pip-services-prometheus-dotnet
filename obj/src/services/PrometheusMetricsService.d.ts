import { IReferences } from 'pip-services-commons-node';
import { RestService } from 'pip-services-rpc-node';
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
export declare class PrometheusMetricsService extends RestService {
    private _cachedCounters;
    private _source;
    private _instance;
    /**
     * Creates a new instance of this service.
     */
    constructor();
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Registers all service routes in HTTP endpoint.
     */
    register(): void;
    /**
     * Handles metrics requests
     *
     * @param req   an HTTP request
     * @param res   an HTTP response
     */
    private metrics;
}
