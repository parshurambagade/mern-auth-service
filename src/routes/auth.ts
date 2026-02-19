import express from "express";
import AuthController from "../controllers/AuthController.js";
import { UserService } from "../services/UserService.js";

const authRouter = express.Router();
const userService = new UserService();
const authController = new AuthController(userService);

authRouter.post("/register", async (req, res) =>
    authController.register(req, res),
);

export default authRouter;
