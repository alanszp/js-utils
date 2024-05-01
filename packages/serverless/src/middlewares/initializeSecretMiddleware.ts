import { createAxios } from "@alanszp/axios-node";
import { ILogger } from "@alanszp/logger";

export function initializeSecretMiddleware(
  getLogger: () => ILogger,
  reloadConfig: () => void
) {
  return {
    before: async (): Promise<void> => {
      try {
        const url = process.env.AWS_SECRET_MANAGER_URL;
        if (!url || !process.env.AWS_SESSION_TOKEN) {
          getLogger().error(
            "initialize_secrets.error.no_env_variables_for_secret_manager"
          );
          return;
        }

        const response = await createAxios().get<{ SecretString: string }>(
          url,
          {
            headers: {
              "X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN,
            },
          }
        );

        const json = JSON.parse(response.data.SecretString) as Record<
          string,
          string
        >;

        const envEntries = Object.entries(json);

        envEntries.forEach(([key, value]) => {
          process.env[key.toString().toUpperCase()] = value;
        });

        reloadConfig();

        getLogger().info("initialize_secrets.succeed", {
          envVarsFetched: envEntries.length,
        });
      } catch (error: unknown) {
        getLogger().error("initialize_secrets.error.generic", { error });
        throw error;
      }
    },
  };
}
