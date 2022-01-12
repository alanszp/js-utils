import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "@alanszp/errors";
import { errorView } from "../views/errorView";

export function returnNotFound(
  _req: Request<any>,
  res: Response,
  _next: NextFunction
): void {
  res.status(404).json(errorView(new NotFoundError()));
}
