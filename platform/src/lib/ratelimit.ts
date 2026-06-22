import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const enabled = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const limiter = enabled
  ? new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(20, "10 s"), prefix: "rl", analytics: true })
  : null;

/** Returns { success } — always allows when Upstash isn't configured (e.g. local dev). */
export async function checkRateLimit(key: string): Promise<{ success: boolean }> {
  if (!limiter) return { success: true };
  const { success } = await limiter.limit(key);
  return { success };
}
