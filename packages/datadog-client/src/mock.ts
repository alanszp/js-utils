import { IDatadogClient } from "./interfaces";

export const mockClient: IDatadogClient = {
    gauge: (key: string, value: number, tags?: string[], timestamp?: number): void => { return; },

    increment: (key: string, value: number, tags?: string[], timestamp?: number): void => { return; },

    histogram: (key: string, value: number, tags?: string[], timestamp?: number): void => { return; },

    flush: (onSuccess?: () => void, onError?: (err: Error) => void): void => onSuccess ? onSuccess() : undefined,
};
