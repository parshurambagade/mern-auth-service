import express from "express";
import AuthController from "../controllers/AuthController.js";
import { UserService } from "../services/UserService.js";
import logger from "../config/logger.js";
import { prisma } from "../config/prisma.js";
import { PrismaClient } from "../../generated/prisma/internal/class.js";

const authRouter = express.Router();
const userService = new UserService(prisma as PrismaClient);
const authController = new AuthController(userService, logger);

authRouter.post("/register", async (req, res, next) =>
    authController.register(req, res, next),
);

export default authRouter;
