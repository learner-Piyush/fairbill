import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_URL_POOLED: z.string().min(1, "DATABASE_URL_POOLED is required"),
  FASTAPI_URL: z.string().min(1, "FASTAPI_URL is required"),
  INTERNAL_API_KEY: z.string().min(1, "INTERNAL_API_KEY is required"),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(input: Record<string, unknown> = process.env): Env {
  // Allow skipping validation during builds if explicitly opted out
  if (
    input.SKIP_ENV_VALIDATION === "true" ||
    input.SKIP_ENV_VALIDATION === "1"
  ) {
    return input as unknown as Env;
  }

  const result = envSchema.safeParse(input);

  if (!result.success) {
    const missingKeys = Array.from(
      new Set(
        result.error.issues.map((issue) => issue.path.join(".") || "unknown")
      )
    );
    // Never log values; only list the missing or invalid variable names
    throw new Error(
      `[fairbill-web] Environment validation failed. Missing or invalid required environment variables: ${missingKeys.join(
        ", "
      )}. Check your .env.local file.`
    );
  }

  return result.data;
}

export const env: Env = validateEnv();
