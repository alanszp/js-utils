import { ILogger } from "@alanszp/logger";
import { Audit, AuditWithState } from "@alanszp/audit";
import { AsyncLocalStorage } from "async_hooks";

interface SharedInternalContext {
  audit: AuditWithState;
  logger: ILogger;
  lifecycleId: string;
  lifecycleChain: string;
  contextId: string;
}
export class SharedContext {
  private context = new AsyncLocalStorage<SharedInternalContext>();

  public run<R>(
    executable: () => R,
    baseLogger: ILogger,
    audit: Audit,
    lifecycleId: string,
    lifecycleChain: string,
    contextId: string
  ): R {
    return this.context.run(
      {
        audit: audit.withState(),
        logger: baseLogger.child({
          lifecycleId,
          lifecycleChain,
        }),
        lifecycleId,
        lifecycleChain,
        contextId,
      },
      executable
    );
  }

  public getLogger(): ILogger | undefined {
    return this.getFromContext("logger");
  }

  public getAudit(): AuditWithState | undefined {
    return this.getFromContext("audit");
  }

  public getLifecycleId(): string | undefined {
    return this.getFromContext("lifecycleId");
  }

  public getLifecycleChain(): string | undefined {
    return this.getFromContext("lifecycleChain");
  }

  public getContextId(): string | undefined {
    return this.getFromContext("getContextId");
  }

  private getFromContext<Type>(propertyName: string): Type | undefined {
    const context = this.context.getStore();
    return context ? context[propertyName] : undefined;
  }
}
