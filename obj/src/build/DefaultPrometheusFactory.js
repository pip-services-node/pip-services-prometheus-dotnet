"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module build */
const pip_services_components_node_1 = require("pip-services-components-node");
const pip_services_commons_node_1 = require("pip-services-commons-node");
const PrometheusCounters_1 = require("../count/PrometheusCounters");
const PrometheusMetricsService_1 = require("../services/PrometheusMetricsService");
/**
 * Creates Prometheus components by their descriptors.
 *
 * @see [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/classes/build.factory.html Factory]]
 * @see [[PrometheusCounters]]
 * @see [[PrometheusMetricsService]]
 */
class DefaultPrometheusFactory extends pip_services_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultPrometheusFactory.PrometheusCountersDescriptor, PrometheusCounters_1.PrometheusCounters);
        this.registerAsType(DefaultPrometheusFactory.PrometheusMetricsServiceDescriptor, PrometheusMetricsService_1.PrometheusMetricsService);
    }
}
DefaultPrometheusFactory.Descriptor = new pip_services_commons_node_1.Descriptor("pip-services", "factory", "prometheus", "default", "1.0");
DefaultPrometheusFactory.PrometheusCountersDescriptor = new pip_services_commons_node_1.Descriptor("pip-services", "counters", "prometheus", "*", "1.0");
DefaultPrometheusFactory.PrometheusMetricsServiceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services", "metrics-service", "prometheus", "*", "1.0");
exports.DefaultPrometheusFactory = DefaultPrometheusFactory;
//# sourceMappingURL=DefaultPrometheusFactory.js.map