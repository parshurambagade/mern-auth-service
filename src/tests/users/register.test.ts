import { describe, expect, it } from "vitest";
import app from "../../app.js";
import request from "supertest";

describe("POST /auth/register", () => {
  describe("All fields are present", () => {
    it("should return 201 status code", async () => {
      // ARRANGE
      const userData = {
        username: "Parshuram",
        email: "parshuram@gmail.com",
        password: "Pass@123",
      };

      // ACT
      const response = await request(app).post("/auth/register").send(userData);

      // ASSERT
      expect(response.statusCode).toBe(201);
    });

    it("should return json data", async () => {
      // ARRANGE
      const userData = {
        username: "Parshuram",
        email: "parshuram@gmail.com",
        password: "Pass@123",
      };

      // ACT
      const response = await request(app).post("/auth/register").send(userData);

      // ASSERT
      expect(response.headers["content-type"]).match(/json/i);
    });
  });

  describe.skip("Some fields missing", () => {});
});
