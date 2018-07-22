import { ConfigParams } from 'pip-services-commons-node';
import { IReferenceable } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { IOpenable } from 'pip-services-commons-node';
import { CachedCounters } from 'pip-services-components-node';
import { Counter } from 'pip-services-components-node';
export declare class PrometheusCounters extends CachedCounters implements IReferenceable, IOpenable {
    private _logger;
    private _connectionResolver;
    private _opened;
    private _source;
    private _instance;
    private _client;
    private _requestRoute;
    constructor();
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    isOpened(): boolean;
    open(correlationId: string, callback: (err: any) => void): void;
    close(correlationId: string, callback: (err: any) => void): void;
    protected save(counters: Counter[]): void;
}
