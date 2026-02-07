import { sum } from "../utils/sum.js";
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("App", () => {
  it("should return correct sum", () => {
    const result = sum(2, 5);
    expect(result).toBe(7);
  });

  it("should return status code 200", async () => {
    const response = await request(app).get("/").send();
    expect(response.statusCode).toBe(200);
  });
});
