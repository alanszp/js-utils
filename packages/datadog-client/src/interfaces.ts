export interface IDatadogClient {
    gauge(key: string, value: number, tags?: string[], timestamp?: number): void;

    increment(key: string, value?: number, tags?: string[], timestamp?: number): void;

    histogram(key: string, value: number, tags?: string[], timestamp?: number): void;

    flush(onSuccess?: () => void, onError?: (err: Error) => void): void;
}

export interface DatadogClientConfig {
    enabled: boolean;
    env: string;
    apiKey: string;
    appKey: string;
    prefix: string;
    flushIntervalSeconds?: number;
    defaultTags?: string[];
}
