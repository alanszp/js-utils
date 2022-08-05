import { errorView } from "@alanszp/express";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@alanszp/errors";
import { Context, ILogger } from "@alanszp/logger";
import { ModelValidationError } from "@alanszp/validations";
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

    if (error instanceof ModelValidationError) {
      instanceLogger.info(`${baseLog}.error.validation`, { error });
      res.status(400).json(errorView(error));
      return;
    }

    if (error instanceof EntityNotFoundError) {
      instanceLogger.info(`${baseLog}.error.typeorm.entity_not_found`, {
        error,
      });
      if (opts.entityNotFound === 400) {
        res
          .status(400)
          .json(errorView(new BadRequestError("Entity not present")));
      } else {
        res.status(404).json(errorView(new NotFoundError()));
      }
      return;
    }

    if (error instanceof QueryFailedError) {
      if ((error as unknown as { code: string }).code === "23505") {
        instanceLogger.info(`${baseLog}.error.typeorm.query_error.duplicate`, {
          error,
        });
        res
          .status(400)
          .json(errorView(new BadRequestError("Entity already exists")));
      } else {
        instanceLogger.error(`${baseLog}.error.typeorm.query_error.unknown`, {
          error,
        });
        res.status(500).json(errorView(new InternalServerError(error)));
      }
      return;
    }

    instanceLogger.error(`${baseLog}.error.unknown`, { error });
    res.status(500).json(errorView(new InternalServerError(error)));
  };
}
