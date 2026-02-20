import { PrismaClient } from "../../generated/prisma/internal/class";
import { UserData } from "../types";

export class UserService {
    constructor(private prisma: PrismaClient) {}

    async create(userData: UserData) {
        const user = await this.prisma.user.create({
            data: userData,
        });
        return user;
    }
}
