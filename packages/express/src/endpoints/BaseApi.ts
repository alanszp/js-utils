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

type DefaultViewFnReturn<CommandReturnType> =
  CommandReturnType extends Viewable<infer ViewReturnType>
    ? ViewReturnType
    : CommandReturnType;

type InferReturnType<
  ViewFunction extends
    | ((crt: CommandReturnType, input: unknown) => unknown)
    | undefined,
  CommandReturnType
> = ViewFunction extends (crt: CommandReturnType, input: unknown) => unknown
  ? ReturnType<ViewFunction>
  : DefaultViewFnReturn<CommandReturnType>;

export type BuildAuthEndpointOptions<
  Input extends BaseModel,
  CommandReturnType,
  ViewFunction extends
    | ((crt: CommandReturnType, input: Input) => unknown)
    | undefined
> = {
  request: AuthRequest;
  inputConstructor: (jwtUser: JWTUser) => Promise<Input> | Input;
  command: (input: Input) => Promise<CommandReturnType>;
  returnCode?: number;
  view?: ViewFunction;
  getLogger: () => ILogger;
};

export class BaseApi extends Controller {
  protected async buildAuthEndpoint<
    Input extends BaseModel,
    CommandReturnType,
    ViewFunction extends
      | ((crt: CommandReturnType, input: Input) => unknown)
      | undefined,
    EndpointReturnType extends InferReturnType<ViewFunction, CommandReturnType>
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
    ViewFunction
  >): Promise<EndpointReturnType> {
    const { path, method, user } = request;
    const baseLog = `${snakeCase(path)}.${snakeCase(method)}`;
    const logger = getLogger();

    const input = await inputConstructor(user);

    logger.info(`${baseLog}.controller.starting`, { input });

    const commandResponse = await command(input);

    this.setStatus(returnCode);
    logger.info(`${baseLog}.controller.succeed`, { returnCode });

    // If a view function is provided, use it to transform the command response
    if (view) {
      return view(commandResponse, input) as EndpointReturnType;
    }

    // If the command response is viewable, use it to transform the command response
    if (isViewable<EndpointReturnType>(commandResponse)) {
      return commandResponse.toView();
    }

    // Otherwise, return the command response as is
    return commandResponse as EndpointReturnType;
  }
}
