// One example test so learners have a place to add characterization tests
// for the bug they choose to fix (Module 6 Block 6.6 honors block).
// Requires `npm install` to be done. Run with `npm test`.
import { describe, it, expect } from "@jest/globals";

describe("smoke", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
