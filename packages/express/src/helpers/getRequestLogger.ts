import { Request } from "express";
import { MockLogger } from "../../../logger/dist";

export function getRequestLogger(req: Request) {
  return req.context?.log || new MockLogger();
}
