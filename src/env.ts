import z from "zod";

export const sentryEnvSchema = z.enum(["local", "development", "production"]);

export const envSchema = z.object({
  SENTRY_ENV: sentryEnvSchema.default("local").readonly(),
  SUPABASE_URL: z.url().readonly(),
  SUPABASE_PUBLISHABLE_KEY: z.string().readonly(),
  SENTRY_AUTH_TOKEN: z.string().optional().readonly(),
  VITE_SENTRY_DSN: z.url().readonly(),
  VITE_SENTRY_ORG: z.string().readonly(),
  VITE_SENTRY_PROJECT: z.string().readonly(),
  VITE_SENTRY_ENV: sentryEnvSchema.default("local").readonly(),
});

const processEnv = typeof process !== "undefined" ? process.env : {};
const viteEnv = typeof import.meta !== "undefined" ? import.meta.env : {};

const mergedEnv = {
  ...processEnv,
  ...viteEnv,
};

const parsedEnvData = envSchema.safeParse(mergedEnv);

if (!parsedEnvData.success) {
  console.error("❌ Invalid environment variables:", parsedEnvData.error.format());
  throw new Error("Invalid environment variables");
}

export const envs = parsedEnvData.data;

// Export the type so we can reference it in env.d.ts
export type EnvConfig = z.infer<typeof envSchema>;
