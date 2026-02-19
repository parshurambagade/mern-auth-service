import { Response } from "express";
import { RegisterRequest } from "../types";
import { UserService } from "../services/UserService";
import logger from "../config/logger";
class AuthController {
    constructor(private userService: UserService) {}

    async register(req: RegisterRequest, res: Response) {
        const { firstName, lastName, email, password } = req.body;

        const newUser = {
            firstName,
            lastName,
            email,
            password,
        };

        try {
            const savedUser = await this.userService.create(newUser);
            res.status(201).json({ id: savedUser?.id });
        } catch (err) {
            logger.error(err);
        }
    }
}

export default AuthController;
