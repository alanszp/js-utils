import { Request } from "express";

export function getIp(req: Request) {
  return req.headers["cf-connecting-ip"] || req.ip || req.socket?.remoteAddress;
}
