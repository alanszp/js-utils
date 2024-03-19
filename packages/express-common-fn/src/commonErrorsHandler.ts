import { appIdentifier } from "@alanszp/core";
import {
  InternalServerError,
  RenderableError,
  HttpRenderableError,
  RenderableView,
} from "@alanszp/errors";
import { Context, ILogger } from "@alanszp/logger";
import { Response } from "express";
import { EntityNotFoundError, QueryFailedError } from "typeorm";

export interface CommonErrorOptions {
  entityNotFound: 400 | 404;
  extraContext: Context;
}

const defaultsOption: CommonErrorOptions = {
  entityNotFound: 404,
  extraContext: {},
};

function render404Error(): RenderableView {
  return {
    code: "not_found",
    message: "Not Found",
    context: {},
    origin: appIdentifier(),
  };
}

function render400Error(message: string): RenderableView {
  return {
    code: "bad_request",
    message,
    context: {},
    origin: appIdentifier(),
  };
}

/**
 * @deprecated Use internalServerError handler in ExpressApp
 */
export function commonErrorsHandler(loggerFn: () => ILogger) {
  return function handleCommonErrors(
    error: unknown,
    res: Response,
    baseLog: string,
    options?: Partial<CommonErrorOptions>
  ): void {
    const logger = loggerFn();

    const opts: CommonErrorOptions = {
      ...defaultsOption,
      ...options,
    };
    const instanceLogger = logger.child(opts.extraContext);

    if (error instanceof RenderableError) {
      const statusCode =
        error instanceof HttpRenderableError ? error.httpCode() : 500;

      if (statusCode >= 500) {
        instanceLogger.error(`${baseLog}.error.${error.code()}`, {
          statusCode,
          error,
        });
      } else {
        instanceLogger.info(`${baseLog}.error.${error.code()}`, {
          statusCode,
          error,
        });
      }

      res.status(statusCode).json(error.toView());
      return;
    }

    if (error instanceof EntityNotFoundError) {
      instanceLogger.info(`${baseLog}.error.typeorm.entity_not_found`, {
        error,
      });
      if (opts.entityNotFound === 400) {
        res.status(400).json(render400Error("Entity not present"));
      } else {
        res.status(404).json(render404Error());
      }
      return;
    }

    if (error instanceof QueryFailedError) {
      if ((error as unknown as { code: string }).code === "23505") {
        instanceLogger.info(`${baseLog}.error.typeorm.query_error.duplicate`, {
          error,
        });
        res.status(400).json(render400Error("Entity already exists"));
      } else {
        instanceLogger.error(`${baseLog}.error.typeorm.query_error.unknown`, {
          error,
        });
        res.status(500).json(new InternalServerError(error).toView());
      }
      return;
    }

    instanceLogger.error(`${baseLog}.error.unknown`, { error });
    res.status(500).json(new InternalServerError(error).toView());
  };
}
