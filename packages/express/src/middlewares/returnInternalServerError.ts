import { ErrorRequestHandler } from "express";
import { InternalServerError } from "@alanszp/errors";
import { errorView } from "../views/errorView";

export const returnInternalServerError: ErrorRequestHandler = (
  error: unknown,
  req,
  res,
  _next
) => {
  req.context.log.error("error_to_client", { error });
  res.status(500).json(errorView(new InternalServerError(error)));
};
