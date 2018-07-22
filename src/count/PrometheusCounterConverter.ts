let _ = require('lodash');

import { Counter } from 'pip-services-components-node';
import { CounterType } from 'pip-services-components-node';
import { StringConverter } from 'pip-services-commons-node';

export class PrometheusCounterConverter {

    public static toString(counters: Counter[], source: string, instance: string): string {
        if (counters == null || counters.length == 0) return "";

        let builder = "";

        for (let counter of counters) {
            let counterName = this.parseCounterName(counter);
            let labels = this.generateCounterLabel(counter, source, instance);

            switch (counter.type) {
                case CounterType.Increment:                        
                    builder += "# TYPE " + counterName + " gauge\n";
                    builder += counterName + labels + " " + StringConverter.toString(counter.count) + "\n";
                    break;
                case CounterType.Interval:
                    builder += "# TYPE " + counterName + "_max gauge\n";
                    builder += counterName + "_max" + labels + " " + StringConverter.toString(counter.max) + "\n";
                    builder += "# TYPE " + counterName + "_min gauge\n";
                    builder += counterName + "_min" + labels + " " + StringConverter.toString(counter.min) + "\n";
                    builder += "# TYPE " + counterName + "_average gauge\n";
                    builder += counterName + "_average" + labels + " " + StringConverter.toString(counter.average) + "\n";
                    builder += "# TYPE " + counterName + "_count gauge\n";
                    builder += counterName + "_count" + labels + " " + StringConverter.toString(counter.count) + "\n";
                    break;
                case CounterType.LastValue:
                    builder += "# TYPE " + counterName + " gauge\n";
                    builder += counterName + labels + " " + StringConverter.toString(counter.last) + "\n";
                    break;
                case CounterType.Statistics:
                    builder += "# TYPE " + counterName + "_max gauge\n";
                    builder += counterName + "_max" + labels + " " + StringConverter.toString(counter.max) + "\n";
                    builder += "# TYPE " + counterName + "_min gauge\n";
                    builder += counterName + "_min" + labels + " " + StringConverter.toString(counter.min) + "\n";
                    builder += "# TYPE " + counterName + "_average gauge\n";
                    builder += counterName + "_average" + labels + " " + StringConverter.toString(counter.average) + "\n";
                    builder += "# TYPE " + counterName + "_count gauge\n";
                    builder += counterName + "_count" + labels + " " + StringConverter.toString(counter.count) + "\n";
                    break;
                //case CounterType.Timestamp: // Prometheus doesn't support non-numeric metrics
                    //builder += "# TYPE " + counterName + " untyped\n";
                    //builder += counterName + labels + " " + StringConverter.toString(counter.time) + "\n";
                    //break;
            }
        }

        return builder;    
    }

    private static generateCounterLabel(counter: Counter, source: string, instance: string): string {
        let labels = {};

        if (source && source != "") labels["source"] = source;
        if (instance && instance != "") labels["instance"] = instance;

        let nameParts = counter.name.split('.');

        // If there are other predictable names from which we can parse labels, we can add them below
        if (nameParts.length >= 3 && nameParts[2] == "exec_time") {
            labels["service"] = nameParts[0];
            labels["command"] = nameParts[1];
        }

        if (_.isEmpty(labels)) return "";

        let builder = "{";
        for (let key in labels) {
            if (builder.length > 1) builder += ",";
            builder += key + '="'+ labels[key] + '"';
        }
        builder += "}";

        return builder;
    }

    private static parseCounterName(counter: Counter): string {
        if (counter == null && counter.name == null && counter.name == "") return "";

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

    private static parseCounterLabels(counter: Counter, source: string, instance: string): any {
        let labels = {};

        if (source && source != "") labels["source"] = source;
        if (instance && instance != "") labels["instance"] = instance;

        let nameParts = counter.name.split('.');

        // If there are other predictable names from which we can parse labels, we can add them below
        if (nameParts.length >= 3 && nameParts[2] == "exec_time") {
            labels["service"] = nameParts[0];
            labels["command"] = nameParts[1];
        }

        return labels;
    }    
}