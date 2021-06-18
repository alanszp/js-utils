import { NextFunction, Request, Response } from "express";

export function accessLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const endTime = process.hrtime.bigint();
    req.context.log.info("", {
      log_type: "access",
      method: req.method,
      env: process.env.NODE_ENV,
      duration: (endTime - startTime).toString(),
      durationMs: ((endTime - startTime) / BigInt(1_000_000)).toString(),
      remoteAddress: req.ip || req.socket?.remoteAddress,
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
