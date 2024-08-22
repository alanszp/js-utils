import { ILogger } from "@alanszp/logger";
import IORedis, { Redis, RedisOptions } from "ioredis";

export class ConnectionManager {
  private static instance: ConnectionManager;

  private connection: Redis;

  private redisConfiguration: RedisOptions;

  private serviceName: string;

  public getLogger: () => ILogger;

  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }

    return ConnectionManager.instance;
  }

  private connect(): Redis {
    if (!this.redisConfiguration) {
      throw new Error("Redis configuration required");
    }

    const redis = new IORedis(this.redisConfiguration);
    redis.setMaxListeners(20);
    redis.on("connect", () => this.getLogger().info("redis.connected"));
    redis.on("ready", () => this.getLogger().info("redis.ready"));
    redis.on("error", (error: Error) =>
      this.getLogger().error("redis.error", { error })
    );
    redis.on("close", () => this.getLogger().warn("redis.closed"));
    redis.on("reconnecting", () => this.getLogger().info("redis.reconnecting"));
    redis.on("end", () => this.getLogger().info("redis.ended"));
    redis.on("wait", () => this.getLogger().info("redis.waiting"));

    return redis;
  }

  public setConfiguration(
    configuration: RedisOptions,
    service: string,
    getLogger: () => ILogger
  ) {
    this.redisConfiguration = configuration;
    this.serviceName = service;
    this.getLogger = getLogger;
  }

  public getServiceName(): string {
    return this.serviceName;
  }

  public getConnection(): Redis {
    if (!this.connection) {
      this.connection = this.connect();
    }

    return this.connection;
  }

  public close(): void {
    this.connection.disconnect();
  }
}
