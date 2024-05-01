import { JWTUser } from "@alanszp/jwt";
import { BaseModel } from "@alanszp/validations";
import { Controller } from "tsoa";
import { Request } from "express";
import { snakeCase } from "lodash";
import { ILogger } from "@alanszp/logger";

export type AuthRequest = Request & { user: JWTUser };

interface Viewable<T> {
  toView: () => T;
}

function isViewable<T>(object: unknown): object is Viewable<T> {
  return (
    typeof object === "object" &&
    object !== null &&
    typeof (object as Viewable<T>).toView === "function"
  );
}

export type BuildAuthEndpointOptions<
  Input extends BaseModel,
  CommandReturnType,
  ViewReturnType,
  ViewFunction extends ((crt: CommandReturnType) => ViewReturnType) | undefined
> = {
  request: AuthRequest;
  inputConstructor: (jwtUser: JWTUser) => Input;
  command: (
    input: Input
  ) => Promise<CommandReturnType & Partial<Viewable<ViewReturnType>>>;
  returnCode?: number;
  view?: ViewFunction;
  getLogger: () => ILogger;
};

type InferReturnType<ViewFunction, CommandReturnType, ViewReturnType> =
  ViewFunction extends undefined // If no view function is provided
    ? CommandReturnType extends Viewable<ViewReturnType> // If the command response has a toView method
      ? ViewReturnType // Return the view return type
      : CommandReturnType // Otherwise, it doesn't have a toView method, return the command return type
    : ViewReturnType; // Otherwise, it has a view function, return the view return type

export class BaseApi extends Controller {
  protected async buildAuthEndpoint<
    Input extends BaseModel,
    CommandReturnType,
    ViewReturnType,
    ViewFunction extends
      | ((crt: CommandReturnType) => ViewReturnType)
      | undefined
  >({
    request,
    inputConstructor,
    command,
    returnCode = 200,
    view,
    getLogger,
  }: BuildAuthEndpointOptions<
    Input,
    CommandReturnType,
    ViewReturnType,
    ViewFunction
  >): Promise<
    InferReturnType<ViewFunction, CommandReturnType, ViewReturnType>
  > {
    const { path, method, user } = request;
    const baseLog = `${snakeCase(path)}.${snakeCase(method)}`;
    const logger = getLogger();

    const input = inputConstructor(user);

    logger.info(`${baseLog}.controller.starting`, { input });

    const commandResponse = await command(input);

    this.setStatus(returnCode);
    logger.info(`${baseLog}.controller.succeed`, { returnCode });

    // If a view function is provided, use it to transform the command response
    if (view) {
      return view(commandResponse) as InferReturnType<
        ViewFunction,
        CommandReturnType,
        ViewReturnType
      >;
    }

    // If the command response is viewable, use it to transform the command response
    if (isViewable<ViewReturnType>(commandResponse)) {
      return commandResponse.toView() as InferReturnType<
        ViewFunction,
        CommandReturnType,
        ViewReturnType
      >;
    }

    // Otherwise, return the command response as is
    return commandResponse as InferReturnType<
      ViewFunction,
      CommandReturnType,
      ViewReturnType
    >;
  }
}
