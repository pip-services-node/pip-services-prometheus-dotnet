import { Counter } from 'pip-services-components-node';
/**
 * Helper class that converts performance counter values into
 * a response from Prometheus metrics service.
 */
export declare class PrometheusCounterConverter {
    /**
     * Converts the given counters to a string that is returned by Prometheus metrics service.
     *
     * @param counters  a list of counters to convert.
     * @param source    a source (context) name.
     * @param instance  a unique instance name (usually a host name).
     */
    static toString(counters: Counter[], source: string, instance: string): string;
    private static generateCounterLabel;
    private static parseCounterName;
    private static parseCounterLabels;
}
