import { sum } from "./utils.js";
import { describe, it, expect } from "vitest";

describe("App", () => {
  it("should return correct sum", () => {
    const result = sum(2, 5);
    expect(result).toBe(7);
  });
});
