"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module count */
/** @hidden */
let _ = require('lodash');
const pip_services_components_node_1 = require("pip-services-components-node");
const pip_services_commons_node_1 = require("pip-services-commons-node");
/**
 * Helper class that converts performance counter values into
 * a response from Prometheus metrics service.
 */
class PrometheusCounterConverter {
    /**
     * Converts the given counters to a string that is returned by Prometheus metrics service.
     *
     * @param counters  a list of counters to convert.
     * @param source    a source (context) name.
     * @param instance  a unique instance name (usually a host name).
     */
    static toString(counters, source, instance) {
        if (counters == null || counters.length == 0)
            return "";
        let builder = "";
        for (let counter of counters) {
            let counterName = this.parseCounterName(counter);
            let labels = this.generateCounterLabel(counter, source, instance);
            switch (counter.type) {
                case pip_services_components_node_1.CounterType.Increment:
                    builder += "# TYPE " + counterName + " gauge\n";
                    builder += counterName + labels + " " + pip_services_commons_node_1.StringConverter.toString(counter.count) + "\n";
                    break;
                case pip_services_components_node_1.CounterType.Interval:
                    builder += "# TYPE " + counterName + "_max gauge\n";
                    builder += counterName + "_max" + labels + " " + pip_services_commons_node_1.StringConverter.toString(counter.max) + "\n";
                    builder += "# TYPE " + counterName + "_min gauge\n";
                    builder += counterName + "_min" + labels + " " + pip_services_commons_node_1.StringConverter.toString(counter.min) + "\n";
                    builder += "# TYPE " + counterName + "_average gauge\n";
                    builder += counterName + "_average" + labels + " " + pip_services_commons_node_1.StringConverter.toString(counter.average) + "\n";
                    builder += "# TYPE " + counterName + "_count gauge\n";
                    builder += counterName + "_count" + labels + " " + pip_services_commons_node_1.StringConverter.toString(counter.count) + "\n";
                    break;
                case pip_services_components_node_1.CounterType.LastValue:
                    builder += "# TYPE " + counterName + " gauge\n";
                    builder += counterName + labels + " " + pip_services_commons_node_1.StringConverter.toString(counter.last) + "\n";
                    break;
                case pip_services_components_node_1.CounterType.Statistics:
                    builder += "# TYPE " + counterName + "_max gauge\n";
                    builder += counterName + "_max" + labels + " " + pip_services_commons_node_1.StringConverter.toString(counter.max) + "\n";
                    builder += "# TYPE " + counterName + "_min gauge\n";
                    builder += counterName + "_min" + labels + " " + pip_services_commons_node_1.StringConverter.toString(counter.min) + "\n";
                    builder += "# TYPE " + counterName + "_average gauge\n";
                    builder += counterName + "_average" + labels + " " + pip_services_commons_node_1.StringConverter.toString(counter.average) + "\n";
                    builder += "# TYPE " + counterName + "_count gauge\n";
                    builder += counterName + "_count" + labels + " " + pip_services_commons_node_1.StringConverter.toString(counter.count) + "\n";
                    break;
                //case CounterType.Timestamp: // Prometheus doesn't support non-numeric metrics
                //builder += "# TYPE " + counterName + " untyped\n";
                //builder += counterName + labels + " " + StringConverter.toString(counter.time) + "\n";
                //break;
            }
        }
        return builder;
    }
    static generateCounterLabel(counter, source, instance) {
        let labels = {};
        if (source && source != "")
            labels["source"] = source;
        if (instance && instance != "")
            labels["instance"] = instance;
        let nameParts = counter.name.split('.');
        // If there are other predictable names from which we can parse labels, we can add them below
        if (nameParts.length >= 3 && nameParts[2] == "exec_time") {
            labels["service"] = nameParts[0];
            labels["command"] = nameParts[1];
        }
        if (_.isEmpty(labels))
            return "";
        let builder = "{";
        for (let key in labels) {
            if (builder.length > 1)
                builder += ",";
            builder += key + '="' + labels[key] + '"';
        }
        builder += "}";
        return builder;
    }
    static parseCounterName(counter) {
        if (counter == null && counter.name == null && counter.name == "")
            return "";
        let nameParts = counter.name.split('.');
        // If there are other predictable names from which we can parse labels, we can add them below
        if (nameParts.length >= 3 && nameParts[2] == "exec_time") {
            return nameParts[2];
        }
        // TODO: are there other assumptions we can make?
        // Or just return as a single, valid name
        return counter.name.toLowerCase()
            .replace(".", "_").replace("/", "_");
    }
    static parseCounterLabels(counter, source, instance) {
        let labels = {};
        if (source && source != "")
            labels["source"] = source;
        if (instance && instance != "")
            labels["instance"] = instance;
        let nameParts = counter.name.split('.');
        // If there are other predictable names from which we can parse labels, we can add them below
        if (nameParts.length >= 3 && nameParts[2] == "exec_time") {
            labels["service"] = nameParts[0];
            labels["command"] = nameParts[1];
        }
        return labels;
    }
}
exports.PrometheusCounterConverter = PrometheusCounterConverter;
//# sourceMappingURL=PrometheusCounterConverter.js.map