import { json, OptionsJson } from "body-parser";
import { NextFunction, Response } from "express";
import { BadRequestError } from "@alanszp/errors";
import { errorView } from "../views/errorView";
import { GenericRequest } from "../types/GenericRequest";

export function jsonBodyParser(options?: OptionsJson) {
  const bodyParser = json(options);
  return function jsonBodyParserMiddleware(
    req: GenericRequest,
    res: Response,
    next: NextFunction
  ): void {
    try {
      bodyParser(req, res, (error?: unknown) => {
        if (!error) return next();
        res.status(400).json(errorView(new BadRequestError("Malformed JSON")));
      });
    } catch (error: unknown) {
      res.status(400).json(errorView(new BadRequestError("Malformed JSON")));
    }
  };
}
