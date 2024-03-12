const shortEnvName: Record<string, string> = {
  production: "prd",
  staging: "stg",
  development: "dev",
  test: "tst",
};

export function appIdentifier() {
  const appName =
    process.env.SERVICE_NAME ?? process.env.API_ORIGIN_NAME ?? "undef";

  const roleName = process.env.ROLE_NAME;

  const env = process.env.NODE_ENV
    ? shortEnvName[process.env.NODE_ENV] ?? process.env.NODE_ENV
    : "dev";

  return `${roleName ? `${appName}:${roleName}` : appName}:${env}`;
}
