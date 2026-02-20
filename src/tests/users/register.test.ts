import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import app from "../../app.js";
import request from "supertest";
import { prisma } from "../../config/prisma.js";
import { ROLES } from "../../constants/index.js";

describe("POST /auth/register", () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    beforeEach(async () => {
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe("All fields present", () => {
        it("should return 201 status code", async () => {
            // ARRANGE
            const userData = {
                firstName: "Parshuram",
                lastName: "Bagade",
                email: "parshuram@gmail.com",
                password: "Pass@123",
            };

            // ACT
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // ASSERT
            expect(response.statusCode).toBe(201);
        });

        it("should return json data", async () => {
            // ARRANGE
            const userData = {
                firstName: "Parshuram",
                lastName: "Bagade",
                email: "parshuram@gmail.com",
                password: "Pass@123",
            };

            // ACT
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // ASSERT
            expect(response.headers["content-type"]).toMatch(/json/i);
        });

        it("should persist the registered user in db", async () => {
            const userData = {
                firstName: "Parshuram",
                lastName: "Bagade",
                email: "parshuram@gmail.com",
                password: "Pass@123",
            };

            await request(app).post("/auth/register").send(userData);

            const users = await prisma.user.findMany();

            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });

        it("should return id of registered user", async () => {
            const userData = {
                firstName: "Parshuram",
                lastName: "Bagade",
                email: "parshuram@gmail.com",
                password: "Pass@123",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            console.log(response.body);
            expect(response.body).toHaveProperty("id");
        });

        it("should assign correct role", async () => {
            const userData = {
                firstName: "Parshuram",
                lastName: "Bagade",
                email: "parshuram@gmail.com",
                password: "Pass@123",
            };

            await request(app).post("/auth/register").send(userData);

            const users = await prisma.user.findMany();
            expect(users[0]).toHaveProperty("role");
            expect(users[0].role).toBe(ROLES.CUSTOMER);
        });

        it("should store hashed password", async () => {
            const userData = {
                firstName: "Parshuram",
                lastName: "Bagade",
                email: "parshuram@gmail.com",
                password: "Pass@123",
            };

            await request(app).post("/auth/register").send(userData);

            const users = await prisma.user.findMany();
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/\$2b\$\d+\$/); // hashed value starts with $2b$10$
        });
    });

    describe.skip("Some fields missing", () => {});
});
