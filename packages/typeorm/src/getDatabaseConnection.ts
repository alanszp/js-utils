import { createConnection, ConnectionOptions } from "typeorm";

export const getDatabaseConnection = (
  testOrmconfig: ConnectionOptions,
  connectionOptions: ConnectionOptions
) =>
  createConnection(
    process.env.NODE_ENV === "test" ? testOrmconfig : connectionOptions
  );
