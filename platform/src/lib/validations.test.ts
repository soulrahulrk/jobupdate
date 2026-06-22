import { describe, it, expect } from "vitest";
import { jobFilterSchema, loginSchema, registerSchema } from "@/lib/validations";

describe("jobFilterSchema", () => {
  it("applies defaults for an empty query", () => {
    const r = jobFilterSchema.parse({});
    expect(r.sort).toBe("recent");
    expect(r.page).toBe(1);
  });

  it("coerces numeric strings", () => {
    const r = jobFilterSchema.parse({ page: "3", salaryMin: "400000" });
    expect(r.page).toBe(3);
    expect(r.salaryMin).toBe(400000);
  });

  it("falls back to safe defaults on invalid sort/page", () => {
    expect(jobFilterSchema.parse({ sort: "bogus" }).sort).toBe("recent");
    expect(jobFilterSchema.parse({ page: "-5" }).page).toBe(1);
  });

  it("accepts a valid region enum", () => {
    expect(jobFilterSchema.parse({ region: "NCR" }).region).toBe("NCR");
  });
});

describe("auth schemas", () => {
  it("rejects passwords shorter than 8 chars", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "short" }).success).toBe(false);
  });
  it("accepts a valid login", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "longenough" }).success).toBe(true);
  });
  it("requires a name on register", () => {
    expect(registerSchema.safeParse({ email: "a@b.com", password: "longenough" }).success).toBe(false);
  });
});
