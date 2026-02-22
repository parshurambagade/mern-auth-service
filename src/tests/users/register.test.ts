import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import app from "../../app.js";
import request from "supertest";
import { prisma } from "../../config/prisma.js";
import { ROLES } from "../../constants/index.js";
import { UserService } from "../../services/UserService.js";
import { PrismaClient } from "../../../generated/prisma/internal/class.js";
import { isValidJWT } from "zod/v4/core";

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

        it("should return 400 status code if email already exhists", async () => {
            const userData = {
                firstName: "Parshuram",
                lastName: "Bagade",
                email: "parshuram@gmail.com",
                password: "Pass@123",
            };
            const userService = new UserService(prisma as PrismaClient);
            await userService.create({ ...userData, role: ROLES.CUSTOMER });

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            const users = await prisma.user.findMany();
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });

        it("should set accessToken and refreshToken inside cookie", async () => {
            const userData = {
                firstName: "Parshuram",
                lastName: "Bagade",
                email: "parshuram@gmail.com",
                password: "Pass@123",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            interface Headers {
                ["set-cookie"]: string[];
            }

            const cookies =
                (response.headers as unknown as Headers)["set-cookie"] || [];
            let accessToken = null,
                refreshToken = null;

            cookies.forEach((cookie) => {
                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split(";")[0].split("=")[1];
                }

                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split(";")[0].split("=")[1];
                }
            });

            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();
        });

        it("should set valid accessToken and refreshToken in cookie", async () => {
            const userData = {
                firstName: "Parshuram",
                lastName: "Bagade",
                email: "parshuram@gmail.com",
                password: "Pass@123",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            interface Headers {
                ["set-cookie"]: string[];
            }

            const cookies =
                (response.headers as unknown as Headers)["set-cookie"] || [];

            let accessToken = "",
                refreshToken = "";

            cookies.forEach((cookie) => {
                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split(";")[0].split("=")[1];
                }

                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split(";")[0].split("=")[1];
                }
            });

            expect(isValidJWT(accessToken)).toBeTruthy();
            expect(isValidJWT(refreshToken)).toBeTruthy();
        });
    });

    describe("Some fields missing", () => {
        it("should return 400 status code if email is not present", async () => {
            const userData = {
                firstName: "Parshuram",
                lastName: "Bagade",
                email: "",
                password: "Pass@123",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // const users = await prisma.user.findMany();
            expect(response.statusCode).toBe(400);
        });

        it("should return 400 status code if firstName is not present", async () => {
            const userData = {
                firstName: "",
                lastName: "Bagade",
                email: "parshuram@gmail.com",
                password: "Pass@123",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // const users = await prisma.user.findMany();
            expect(response.statusCode).toBe(400);
        });

        it("should return 400 status code if lastName is not present", async () => {
            const userData = {
                firstName: "Parshuram",
                lastName: "",
                email: "parshuram@gmail.com",
                password: "Pass@123",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // const users = await prisma.user.findMany();
            expect(response.statusCode).toBe(400);
        });

        it("should return 400 status code if password is not present", async () => {
            const userData = {
                firstName: "Parshuram",
                lastName: "Bagade",
                email: "parshuram@gmail.com",
                // password: "Pass@123",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // const users = await prisma.user.findMany();
            expect(response.statusCode).toBe(400);
        });
    });

    describe("Validation checks", () => {
        it("should return 400 status code if password has less than 6 characters", async () => {
            const userData = {
                firstName: "Parshuram",
                lastName: "Bagade",
                email: "parshuram@gmail.com",
                password: "Pass",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            const users = await prisma.user.findMany();

            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        });

        it("should return 400 status code if email is not valid", async () => {
            const userData = {
                firstName: "Parshuram",
                lastName: "Bagade",
                email: "parshuramgmail.com",
                password: "Pass@123",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            expect(response.statusCode).toBe(400);
        });
    });
});
