"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_components_node_1 = require("pip-services-components-node");
const pip_services_commons_node_1 = require("pip-services-commons-node");
const PrometheusCounters_1 = require("../count/PrometheusCounters");
const PrometheusMetricsService_1 = require("../services/PrometheusMetricsService");
class DefaultPrometheusFactory extends pip_services_components_node_1.Factory {
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