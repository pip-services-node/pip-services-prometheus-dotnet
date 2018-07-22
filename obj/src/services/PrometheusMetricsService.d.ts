import { IReferences } from 'pip-services-commons-node';
import { RestService } from 'pip-services-rpc-node';
export declare class PrometheusMetricsService extends RestService {
    private _cachedCounters;
    private _source;
    private _instance;
    constructor();
    setReferences(references: IReferences): void;
    register(): void;
    private metrics;
}
