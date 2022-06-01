import { Context } from "aws-lambda";
import { MiddlewareObj } from "@middy/core";

export type LambdaContext = Context;
export type LambdaMiddleware<
  TEvent = unknown,
  TResult = unknown,
  TErr = Error,
  TContext extends LambdaContext = LambdaContext
> = MiddlewareObj<TEvent, TResult, TErr, TContext>;
