import { Counter } from 'pip-services-components-node';
export declare class PrometheusCounterConverter {
    static toString(counters: Counter[], source: string, instance: string): string;
    private static generateCounterLabel;
    private static parseCounterName;
    private static parseCounterLabels;
}
