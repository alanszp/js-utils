export function appIdentifier() {
  const appName = process.env.API_ORIGIN_NAME || "undefined";
  const env = process.env.NODE_ENV || "development";
  return `${appName}:${env}`;
}
