import { describe, expect, it } from "vitest";
import { getFreshSeed, seedWorkspace } from "@/lib/demo-data";

describe("demo workspace", () => {
  it("returns an isolated copy for safe reset", () => {
    const copy = getFreshSeed();
    copy.projects[0].name = "Changed";
    expect(seedWorkspace.projects[0].name).toBe("Website launch");
  });

  it("starts with linked project records", () => {
    const projectIds = new Set(seedWorkspace.projects.map((project) => project.id));
    expect(seedWorkspace.milestones.every((milestone) => projectIds.has(milestone.projectId))).toBe(true);
    expect(seedWorkspace.invoices.every((invoice) => projectIds.has(invoice.projectId))).toBe(true);
  });
});
