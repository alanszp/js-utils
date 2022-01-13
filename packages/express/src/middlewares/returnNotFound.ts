import { NextFunction, Response } from "express";
import { NotFoundError } from "@alanszp/errors";
import { errorView } from "../views/errorView";
import { GenericRequest } from "../types/GenericRequest";

export function returnNotFound(
  _req: GenericRequest,
  res: Response,
  _next: NextFunction
): void {
  res.status(404).json(errorView(new NotFoundError()));
}
