import { LambdaContext } from "./middyTypes";

export type Lambda<TEvent, TContext extends LambdaContext, TResult> = (
  event: TEvent,
  context: TContext
) => Promise<TResult> | void;
