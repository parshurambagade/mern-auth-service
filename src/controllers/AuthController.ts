import { NextFunction, Response } from "express";
import { RegisterRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { ROLES } from "../constants";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "../schemas";

class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async register(req: RegisterRequest, res: Response, next: NextFunction) {
        try {
            const validation = RegisterSchema.safeParse(req.body);
            if (!validation.success) {
                const errors = validation.error.issues.map((issue) => ({
                    type: "validation",
                    path: issue.path[0],
                    message: issue.message,
                    location: "Body",
                }));
                res.status(400).json({
                    errors,
                });
                return;
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(
                req.body.password,
                saltRounds,
            );

            const { firstName, lastName, email } = validation.data;

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
