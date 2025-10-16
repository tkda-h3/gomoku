import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createGomokuCommand } from "../commands/gomoku.js";

describe("Gomoku play command", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it("should output black and white endpoints", async () => {
    const command = createGomokuCommand();

    await command.parseAsync([
      "node",
      "test",
      "--black-endpoint",
      "http://localhost:3000/black",
      "--white-endpoint",
      "http://localhost:3001/white",
    ]);

    expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      1,
      "Black endpoint: http://localhost:3000/black"
    );
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      2,
      "White endpoint: http://localhost:3001/white"
    );
  });

  it("should handle HTTPS endpoints", async () => {
    const command = createGomokuCommand();

    await command.parseAsync([
      "node",
      "test",
      "--black-endpoint",
      "https://api.example.com/black",
      "--white-endpoint",
      "https://api.example.com/white",
    ]);

    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      1,
      "Black endpoint: https://api.example.com/black"
    );
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      2,
      "White endpoint: https://api.example.com/white"
    );
  });
});
