import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/ratelimit", () => ({ checkRateLimit: vi.fn(async () => ({ success: true })) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/db", () => ({
  db: { savedJob: { findUnique: vi.fn(), create: vi.fn(), delete: vi.fn() } },
}));

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { toggleSavedJob } from "@/features/jobs/actions";

const JOB_ID = "cl9ebqhxk00003b600tymydho"; // valid cuid shape

describe("toggleSavedJob — auth guard", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws UNAUTHENTICATED when there is no session", async () => {
    vi.mocked(auth).mockResolvedValue(null as never);
    await expect(toggleSavedJob(JOB_ID)).rejects.toThrow("UNAUTHENTICATED");
    expect(db.savedJob.create).not.toHaveBeenCalled();
  });

  it("creates a save when authenticated and none exists", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user1" } } as never);
    vi.mocked(db.savedJob.findUnique).mockResolvedValue(null as never);
    const res = await toggleSavedJob(JOB_ID);
    expect(db.savedJob.create).toHaveBeenCalledWith({ data: { userId: "user1", jobId: JOB_ID } });
    expect(res).toEqual({ saved: true });
  });

  it("removes a save when one already exists", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user1" } } as never);
    vi.mocked(db.savedJob.findUnique).mockResolvedValue({ id: "saved1" } as never);
    const res = await toggleSavedJob(JOB_ID);
    expect(db.savedJob.delete).toHaveBeenCalledWith({ where: { id: "saved1" } });
    expect(res).toEqual({ saved: false });
  });
});
