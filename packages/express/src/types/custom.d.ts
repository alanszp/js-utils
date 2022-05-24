import { ILogger, AuditWithState } from "@alanszp/common-models";
import { JWTUser } from "@alanszp/jwt";
import { AuthMethod } from "./AuthMethod";

declare global {
  namespace Express {
    export interface Request {
      context: {
        lifecycleId: string;
        lifecycleChain: string;
        authenticated: AuthMethod[];
        log: ILogger;
        audit: AuditWithState;
        jwtUser?: JWTUser;
      };
    }
  }
}
