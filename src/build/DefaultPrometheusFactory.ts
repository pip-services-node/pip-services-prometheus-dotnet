/** @module build */
import { Factory } from 'pip-services-components-node';
import { Descriptor } from 'pip-services-commons-node';

import { PrometheusCounters } from '../count/PrometheusCounters';
import { PrometheusMetricsService } from '../services/PrometheusMetricsService';

/**
 * Contains static read-only descriptors for [[PrometheusCounters]] and [[PrometheusMetricsService]] 
 * (as well as a default "prometheus" factory descriptor).
 * 
 * @see [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/classes/build.factory.html Factory]]
 */
export class DefaultPrometheusFactory extends Factory {
	public static readonly Descriptor = new Descriptor("pip-services", "factory", "prometheus", "default", "1.0");
	public static readonly PrometheusCountersDescriptor: Descriptor = new Descriptor("pip-services", "counters", "prometheus", "*", "1.0");
	public static readonly PrometheusMetricsServiceDescriptor: Descriptor = new Descriptor("pip-services", "metrics-service", "prometheus", "*", "1.0");

	/**
	 * Creates a new DefaultPrometheusFactory object, containing [[PrometheusCounters]] and 
	 * [[PrometheusMetricsService]] object factories.
	 * 
	 * @see [[PrometheusCounters]]
     * @see [[PrometheusMetricsService]]
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultPrometheusFactory.PrometheusCountersDescriptor, PrometheusCounters);
		this.registerAsType(DefaultPrometheusFactory.PrometheusMetricsServiceDescriptor, PrometheusMetricsService);
	}
}