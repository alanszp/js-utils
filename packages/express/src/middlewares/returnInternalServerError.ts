import { ErrorRequestHandler, NextFunction, Response } from "express";
import { InternalServerError } from "@alanszp/errors";
import { errorView } from "../views/errorView";
import { GenericRequest } from "../types/GenericRequest";
import { ILogger } from "@alanszp/logger";

export type GetInternalServerErrorMiddleware = (
  getLogger: () => ILogger
) => ErrorRequestHandler;

export const returnInternalServerError: GetInternalServerErrorMiddleware =
  (getLogger: () => ILogger) =>
  (error: unknown, req: GenericRequest, res: Response, _next: NextFunction) => {
    res.status(500).json(errorView(new InternalServerError(error)));
    getLogger().error("error_to_client", { error });
  };
