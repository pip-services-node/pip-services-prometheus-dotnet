/** @module build */
import { Factory } from 'pip-services-components-node';
import { Descriptor } from 'pip-services-commons-node';
/**
 * Creates Prometheus components by their descriptors.
 *
 * @see [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/classes/build.factory.html Factory]]
 * @see [[PrometheusCounters]]
 * @see [[PrometheusMetricsService]]
 */
export declare class DefaultPrometheusFactory extends Factory {
    static readonly Descriptor: Descriptor;
    static readonly PrometheusCountersDescriptor: Descriptor;
    static readonly PrometheusMetricsServiceDescriptor: Descriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
