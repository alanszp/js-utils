import { Context, ILogger, LogLevel } from "./interfaces";
import { serialize } from "./serializer";

export class Logger implements ILogger {

    public baseLogger: any;

    constructor(baseLogger) {
        this.baseLogger = baseLogger;
    }

    public trace(code: string, context?: Context): void {
        return this.log(LogLevel.TRACE, code, context);
    }

    public debug(code: string, context?: Context) {
        return this.log(LogLevel.DEBUG, code, context);
    }

    public info(code: string, context?: Context) {
        return this.log(LogLevel.INFO, code, context);
    }

    public warn(code: string, context?: Context) {
        return this.log(LogLevel.WARN, code, context);
    }

    public error(code: string, context?: Context) {
        return this.log(LogLevel.ERROR, code, context);
    }

    public child(context?: Context) {
        return new Logger(this.baseLogger.child(context || {}));
    }

    private log(level: LogLevel, code: string, context: Context = {}) {
        context.code = code;
        return this.baseLogger[level](serialize(context));
    }
}
