import { JWTUser } from "@alanszp/jwt";
import { BaseModel } from "@alanszp/validations";
import { Controller } from "tsoa";
import { Request } from "express";
import { snakeCase } from "lodash";
import { getLogger } from "@/getLogger";

export type AuthRequest = Request & { user: JWTUser };

export type BuildAuthControllerOptions<
  Input extends BaseModel,
  CommandReturnType,
  ViewReturnType,
> = {
  request: AuthRequest;
  inputConstructor: (jwtUser: JWTUser) => Input;
  command: (
    input: Input,
  ) => Promise<CommandReturnType & { toView?: () => ViewReturnType }>;
  returnCode?: number;
  view?: (commandReturn: CommandReturnType) => ViewReturnType;
};

export class BaseController extends Controller {
  protected async buildAuthController<
    Input extends BaseModel,
    CommandReturnType,
    ViewReturnType,
  >({
    request,
    inputConstructor,
    command,
    returnCode = 200,
    view,
  }: BuildAuthControllerOptions<
    Input,
    CommandReturnType,
    ViewReturnType
  >): Promise<ViewReturnType> {
    const { path, method, user } = request;
    const baseLog = `${snakeCase(path)}.${snakeCase(method)}`;
    const logger = getLogger();

    const input = inputConstructor(user);

    logger.info(`${baseLog}.controller.starting`, { input });

    const viewResponse = await command(input);

    this.setStatus(returnCode);
    logger.info(`${baseLog}.controller.succeed`, { returnCode });

    return view
      ? view(viewResponse)
      : viewResponse?.toView &&
          typeof viewResponse.toView === "function" &&
          viewResponse.toView.arguments === 0
        ? viewResponse.toView()
        : (viewResponse as ViewReturnType);
  }
}
