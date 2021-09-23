import { Request } from "express";
import { MockLogger } from "@alanszp/logger";

export function getRequestLogger(req: Request) {
  return req.context?.log || new MockLogger();
}
