/** @module build */
import { Factory } from 'pip-services-components-node';
import { Descriptor } from 'pip-services-commons-node';

import { PrometheusCounters } from '../count/PrometheusCounters';
import { PrometheusMetricsService } from '../services/PrometheusMetricsService';

/**
 * Creates Prometheus components by their descriptors.
 * 
 * @see [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/classes/build.factory.html Factory]]
 * @see [[PrometheusCounters]]
 * @see [[PrometheusMetricsService]]
 */
export class DefaultPrometheusFactory extends Factory {
	public static readonly Descriptor = new Descriptor("pip-services", "factory", "prometheus", "default", "1.0");
	public static readonly PrometheusCountersDescriptor: Descriptor = new Descriptor("pip-services", "counters", "prometheus", "*", "1.0");
	public static readonly PrometheusMetricsServiceDescriptor: Descriptor = new Descriptor("pip-services", "metrics-service", "prometheus", "*", "1.0");

	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultPrometheusFactory.PrometheusCountersDescriptor, PrometheusCounters);
		this.registerAsType(DefaultPrometheusFactory.PrometheusMetricsServiceDescriptor, PrometheusMetricsService);
	}
}