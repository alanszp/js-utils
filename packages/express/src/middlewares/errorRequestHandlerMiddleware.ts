import { ErrorRequestHandler, NextFunction, Response } from "express";
import {
  HttpRenderableError,
  InternalServerError,
  RenderableError,
} from "@alanszp/errors";
import { appIdentifier } from "@alanszp/core";
import { ValidateError } from "tsoa";
import { GenericRequest } from "../types/GenericRequest";
import { ILogger } from "@alanszp/logger";
import { getRequestBaseLog } from "../helpers/getRequestBaseLog";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { render400Error, render404Error } from "../helpers/renderErrorJson";
import { mapValues } from "lodash";

export type ErrorRequestHandlerMiddleware = (
  getLogger: () => ILogger
) => ErrorRequestHandler;

export const errorRequestHandlerMiddleware: ErrorRequestHandlerMiddleware =
  (getLogger: () => ILogger) =>
  (error: unknown, req: GenericRequest, res: Response, next: NextFunction) => {
    const logger = getLogger();
    const baseLog = getRequestBaseLog(req);

    try {
      if (error instanceof ValidateError) {
        const errors = mapValues(error.fields, ({ message: rawMessage }) => {
          // TSOA Error message format: "Something went wrong. Issues: A JSON with the errors."
          if (rawMessage.includes(" Issues: ")) {
            const [message, issues] = rawMessage.split(" Issues: ");
            try {
              // Try to parse issues as JSON
              return {
                message,
                issues: JSON.parse(issues),
              };
            } catch (error) {
              // Send unparsable issues as string
              return { message: rawMessage, issues };
            }
          }

          return { message: rawMessage };
        });
        return res.status(400).json({
          code: "json_schema_error",
          message: "Error to validate JSON Schema",
          context: {
            errors,
          },
          origin: appIdentifier(),
        });
      }

      if (error instanceof RenderableError) {
        const statusCode =
          error instanceof HttpRenderableError ? error.httpCode() : 500;

        if (statusCode >= 500) {
          logger.error(`${baseLog}.error.${error.code()}`, {
            statusCode,
            error,
          });
        } else {
          logger.info(`${baseLog}.error.${error.code()}`, {
            statusCode,
            error,
          });
        }

        res.status(statusCode).json(error.toView());
        return;
      }

      if (error instanceof EntityNotFoundError) {
        logger.info(`${baseLog}.error.typeorm.entity_not_found`, {
          error,
        });
        res.status(404).json(render404Error());
        return;
      }

      if (error instanceof QueryFailedError) {
        if ((error as unknown as { code: string }).code === "23505") {
          logger.info(`${baseLog}.error.typeorm.query_error.duplicate`, {
            error,
          });
          res.status(400).json(render400Error("Entity already exists"));
        } else {
          logger.error(`${baseLog}.error.typeorm.query_error.unknown`, {
            error,
          });
          res.status(500).json(new InternalServerError(error).toView());
        }
        return;
      }

      res.status(500).json(new InternalServerError(error).toView());
      logger.error(
        `${baseLog}.error.return_internal_server_error.error_to_client`,
        { error }
      );
    } catch (errorOfError: unknown) {
      try {
        // Try one last time to log the error
        logger.error(
          `${baseLog}.error.return_internal_server_error.error_rendering_error_to_client`,
          { error: errorOfError }
        );
      } catch (_error: unknown) {}

      res.status(500).json({
        code: "internal_server_error",
        message: "Internal server error",
        context: {},
      });
    }
  };
