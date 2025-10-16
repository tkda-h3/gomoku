import { describe, it, expect } from "vitest";

describe("Example test suite", () => {
  it("should pass a simple test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should check string equality", () => {
    const name = "world";
    expect(`hello, ${name}`).toBe("hello, world");
  });
});
