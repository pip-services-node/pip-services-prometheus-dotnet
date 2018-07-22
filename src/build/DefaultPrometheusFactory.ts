import { Factory } from 'pip-services-components-node';
import { Descriptor } from 'pip-services-commons-node';

import { PrometheusCounters } from '../count/PrometheusCounters';
import { PrometheusMetricsService } from '../services/PrometheusMetricsService';

export class DefaultPrometheusFactory extends Factory {
	public static readonly Descriptor = new Descriptor("pip-services", "factory", "prometheus", "default", "1.0");
	public static readonly PrometheusCountersDescriptor: Descriptor = new Descriptor("pip-services", "counters", "prometheus", "*", "1.0");
	public static readonly PrometheusMetricsServiceDescriptor: Descriptor = new Descriptor("pip-services", "metrics-service", "prometheus", "*", "1.0");

	public constructor() {
        super();
		this.registerAsType(DefaultPrometheusFactory.PrometheusCountersDescriptor, PrometheusCounters);
		this.registerAsType(DefaultPrometheusFactory.PrometheusMetricsServiceDescriptor, PrometheusMetricsService);
	}
}