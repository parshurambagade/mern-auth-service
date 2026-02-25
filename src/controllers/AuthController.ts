import { NextFunction, Response } from "express";
import { RegisterRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { ROLES } from "../constants";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "../schemas";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { TokenService } from "../services/TokenService";
class AuthController {
    constructor(
        private userService: UserService,
        private tokenService: TokenService,
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

            const jwtPayload: JwtPayload = {
                sub: String(savedUser.id),
                role: savedUser.role,
            };

            const accessToken =
                this.tokenService.generateAccessToken(jwtPayload);

            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

            // store refresh token in db
            const savedRefreshToken = await prisma.refreshToken.create({
                data: {
                    userId: savedUser.id,
                    expiresAt: new Date(Date.now() + MS_IN_YEAR),
                },
            });
            const refreshToken = this.tokenService.generateRefreshToken({
                ...jwtPayload,
                id: String(savedRefreshToken.id),
            });

            res.cookie("accessToken", accessToken, {
                sameSite: "strict",
                domain: "localhost",
                httpOnly: true,
                maxAge: 1000 * 60 * 60, // 1 hour
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
            });

            res.status(201).json({ id: savedUser?.id });
        } catch (err) {
            next(err);
            return;
        }
    }
}

export default AuthController;
