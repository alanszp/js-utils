import { ILogger } from "@alanszp/logger";
import { AuditWithState } from "@alanszp/audit";
import { JWTUser } from "@alanszp/jwt";
import { AuthMethod } from "./AuthMethod";

declare global {
  namespace Express {
    export interface Request {
      context: {
        lifecycleId: string;
        lifecycleChain: string;
        contextId: string;
        authenticated: AuthMethod[];
        log: ILogger;
        audit: AuditWithState;
        jwtUser?: JWTUser;
      };
    }
  }
}
