export type RenderableContext = Record<string, unknown>;

export interface RenderableError {
  code(): string;
  renderMessage(): string;
  context(): RenderableContext;
}
