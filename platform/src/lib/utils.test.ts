import { describe, it, expect } from "vitest";
import { formatSalary, REGION_LABEL, EXP_LABEL } from "@/lib/utils";

describe("formatSalary", () => {
  it("returns null when no values", () => {
    expect(formatSalary(null, null)).toBeNull();
    expect(formatSalary(undefined, undefined)).toBeNull();
  });

  it("formats a whole-number range in LPA", () => {
    expect(formatSalary(400000, 700000)).toBe("₹4–7 LPA");
    expect(formatSalary(300000, 500000)).toBe("₹3–5 LPA");
  });

  it("formats fractional lakhs to one decimal", () => {
    expect(formatSalary(350000, 500000)).toBe("₹3.5–5 LPA");
  });

  it("formats min-only with a plus", () => {
    expect(formatSalary(400000, null)).toBe("₹4+ LPA");
  });

  it("formats max-only", () => {
    expect(formatSalary(null, 700000)).toBe("₹7 LPA");
  });
});

describe("label maps", () => {
  it("maps regions and experience", () => {
    expect(REGION_LABEL.NCR).toBe("Delhi-NCR");
    expect(EXP_LABEL.FRESHER).toBe("Fresher");
    expect(EXP_LABEL.ZERO_ONE).toBe("0–1 yr");
  });
});
