import { NextFunction, Response } from "express";
import { GenericRequest } from "../types/GenericRequest";
import { render404Error } from "../helpers/renderErrorJson";

export function returnNotFound(
  _req: GenericRequest,
  res: Response,
  _next: NextFunction
): void {
  res.status(404).json(render404Error());
}
