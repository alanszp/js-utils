import { json, OptionsJson } from "body-parser";
import { NextFunction, Response } from "express";
import { GenericRequest } from "../types/GenericRequest";
import { render400Error } from "../helpers/renderErrorJson";

export function jsonBodyParser(options?: OptionsJson) {
  const bodyParser = json({ limit: "1mb", ...options });
  return function jsonBodyParserMiddleware(
    req: GenericRequest,
    res: Response,
    next: NextFunction
  ): void {
    try {
      bodyParser(req, res, (error?: unknown) => {
        if (!error) return next();
        res.status(400).json(render400Error("Malformed JSON"));
      });
    } catch (error: unknown) {
      res.status(400).json(render400Error("Malformed JSON"));
    }
  };
}
