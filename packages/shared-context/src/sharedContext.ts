import { Audit, AuditWithState } from "@alanszp/common-models";
import { AsyncLocalStorage } from "async_hooks";
import { SharedContextNotInitializedException } from "./SharedContextNotInitializedException";
import { ILogger } from "@alanszp/common-models";

interface SharedInternalContext {
  audit: AuditWithState;
  logger: ILogger;
  lifecycleId: string;
  lifecycleChain: string;
}

export class SharedContext {
  private context: AsyncLocalStorage<SharedInternalContext>;
  private lifecycleId: string;

  private lifecycleChain: string;

  constructor(defaultLifecycleId: string, defaultLifecycleChain: string) {
    this.context = new AsyncLocalStorage<SharedInternalContext>();
    this.lifecycleId = defaultLifecycleId;
    this.lifecycleChain = defaultLifecycleChain;
  }

  public run(
    executable: <R>() => R | void,
    baseLogger: ILogger,
    audit: Audit,
    customLifecycleId?: string,
    customLifecycleChain?: string
  ) {
    const lifecycleId = customLifecycleId || this.lifecycleId;
    const lifecycleChain = customLifecycleChain || this.lifecycleChain;

    this.context.run(
      {
        audit: audit.withState(),
        logger: baseLogger.child({
          lifecycleId,
          lifecycleChain,
        }),
        lifecycleId,
        lifecycleChain,
      },
      executable
    );
  }

  public getLogger(): ILogger {
    const context = this.context.getStore();
    if (!context) {
      throw new SharedContextNotInitializedException();
    }

    return context.logger;
  }

  public getAudit(): AuditWithState {
    const context = this.context.getStore();
    if (!context) {
      throw new SharedContextNotInitializedException();
    }

    return context.audit;
  }

  public getLifecycleId(): string {
    return this.lifecycleId;
  }

  public getLifecycleChain(): string {
    return this.lifecycleChain;
  }
}
