import { ILogger } from "@alanszp/logger";
import { Audit, AuditWithState } from "@alanszp/audit";
import { AsyncLocalStorage } from "async_hooks";

export interface SharedInternalContext {
  audit: AuditWithState;
  logger: ILogger;
  lifecycleId: string;
  lifecycleChain: string;
  contextId: string;
}
export class SharedContext {
  private context = new AsyncLocalStorage<SharedInternalContext>();

  public run<R>(
    executable: (context: SharedInternalContext) => R,
    internalContext: SharedInternalContext
  ): R {
    const { logger, contextId, lifecycleId, lifecycleChain } = internalContext;
    const context = {
      ...internalContext,
      logger: logger.child({
        lid: lifecycleId,
        lch: lifecycleChain,
        cid: contextId,
      }),
    };
    return this.context.run(context, () => executable(context));
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
