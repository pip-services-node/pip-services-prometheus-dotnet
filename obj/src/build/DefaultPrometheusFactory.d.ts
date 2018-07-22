import { Factory } from 'pip-services-components-node';
import { Descriptor } from 'pip-services-commons-node';
export declare class DefaultPrometheusFactory extends Factory {
    static readonly Descriptor: Descriptor;
    static readonly PrometheusCountersDescriptor: Descriptor;
    static readonly PrometheusMetricsServiceDescriptor: Descriptor;
    constructor();
}
