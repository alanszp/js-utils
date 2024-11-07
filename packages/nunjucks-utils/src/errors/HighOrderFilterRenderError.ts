import { RenderableError } from "@alanszp/errors";

export class HighOrderFilterRenderError extends RenderableError {
  constructor(public templateString: string, public errorMessage: string) {
    super(
      `High Order filter render error: ${errorMessage}\nTemplate: ${templateString}`
    );
  }

  code() {
    return "high_order_filter_render_error";
  }

  context() {
    return {
      templateString: this.templateString,
      errorMessage: this.errorMessage,
    };
  }
}
