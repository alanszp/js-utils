import { ILogger } from "@alanszp/logger";
import { AuthMethod } from "./AuthMethod";

declare global {
  namespace Express {
    export interface Request {
      context: {
        lifecycleId: string;
        lifecycleChain: string;
        authenticated: AuthMethod[];
        log: ILogger;
      };
    }
  }
}
