import { NextFunction, Response } from "express";
import { RegisterRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { ROLES } from "../constants";
import bcrypt from "bcryptjs";
class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async register(req: RegisterRequest, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password } = req.body;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: ROLES.CUSTOMER,
        };
        this.logger.debug("Request body contains: ", {
            ...newUser,
            password: "******",
        });
        try {
            const savedUser = await this.userService.create(newUser);
            this.logger.info("User has been registered: ", {
                id: savedUser?.id,
            });
            res.status(201).json({ id: savedUser?.id });
        } catch (err) {
            next(err);
            return;
        }
    }
}

export default AuthController;
