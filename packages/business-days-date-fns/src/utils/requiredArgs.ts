export function requiredArgs(required: number, args: unknown[]): void {
  if (args.length < required) {
    throw new TypeError(`${required} argument${required > 1 ? "s" : ""} required, but only ${args.length} present`);
  }
}
