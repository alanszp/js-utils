import { Request } from "express";
import { snakeCase } from "lodash";

export function getRequestBaseLog(req: Request): string {
  return `${snakeCase(req.path)}.${snakeCase(req.method)}`;
}
