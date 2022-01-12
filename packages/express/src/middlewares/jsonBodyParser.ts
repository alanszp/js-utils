import { json, OptionsJson } from "body-parser";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@alanszp/errors";
import { errorView } from "../views/errorView";

export function jsonBodyParser(options?: OptionsJson) {
  const bodyParser = json(options);
  return function jsonBodyParserMiddleware(
    req: Request<any>,
    res: Response,
    next: NextFunction
  ): void {
    try {
      bodyParser(req, res, next);
    } catch (error: unknown) {
      res.status(400).json(errorView(new BadRequestError("Malformed JSON")));
    }
  };
}
