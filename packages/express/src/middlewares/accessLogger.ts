import { NextFunction, Request, Response } from "express";
import { LogType } from "@alanszp/logger";

export function accessLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const endTime = process.hrtime.bigint();
    req.context.log.info("", {
      log_type: LogType.ACCESS,
      method: req.method,
      env: process.env.NODE_ENV,
      duration: (endTime - startTime).toString(),
      durationMs: ((endTime - startTime) / BigInt(1_000_000)).toString(),
      remoteAddress:
        req.headers["cf-connecting-ip"] || req.ip || req.socket?.remoteAddress,
      forwardedFor: req.headers["x-forwarded-for"],
      authentication: req.context.authenticated,
      statusCode: res.statusCode,
      url: req.originalUrl || req.url,
      httpVersion: `${req.httpVersionMajor}.${req.httpVersionMinor}`,
      referrer: req.headers.referer || req.headers.referrer || "-",
      userAgent: req.headers["user-agent"],
      contentLength: res.getHeader("content-length"),
    });
  });

  return next();
}
