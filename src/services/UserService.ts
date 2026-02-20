import createHttpError from "http-errors";
import { PrismaClient } from "../../generated/prisma/internal/class";
import { UserData } from "../types";

export class UserService {
    constructor(private prisma: PrismaClient) {}

    async create(userData: UserData) {
        const exhistingUser = await this.prisma.user.findFirst({
            where: { email: userData.email },
        });

        if (exhistingUser) {
            const err = createHttpError(400, "Email is already registered!");
            throw err;
        }
        const user = await this.prisma.user.create({
            data: userData,
        });
        return user;
    }
}
