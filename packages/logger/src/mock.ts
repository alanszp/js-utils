import { Context, ILogger, LogLevel } from "../../common-models/dist";

export function createMockLogger(config: any): ILogger {
  return new MockLogger();
}

export class MockLogger implements ILogger {
  public log(level: LogLevel, code: string, context: Context = {}) {
    return;
  }

  public trace(code: string, context?: Context) {
    return;
  }

  public debug(code: string, context?: Context) {
    return;
  }

  public info(code: string, context?: Context) {
    return;
  }

  public warn(code: string, context?: Context) {
    return;
  }

  public error(code: string, context?: Context) {
    return;
  }

  public child(context?: Context) {
    return this;
  }
}
