export interface IQueueService {
    enqueue(item: any): Promise<void>;
    dequeue(): Promise<any>;
    peek(): Promise<any>;
    isEmpty(): Promise<boolean>;
    size(): Promise<number>;
}

