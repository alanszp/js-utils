import { ErrorRequestHandler, NextFunction, Response } from "express";
import { InternalServerError } from "@alanszp/errors";
import { errorView } from "../views/errorView";
import { GenericRequest } from "../types/GenericRequest";

export const returnInternalServerError: ErrorRequestHandler = (
  error: unknown,
  req: GenericRequest,
  res: Response,
  _next: NextFunction
) => {
  res.status(500).json(errorView(new InternalServerError(error)));
  req.context?.log.error("error_to_client", { error });
};
