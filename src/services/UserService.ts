import logger from "../config/logger";
import { prisma } from "../config/prisma";
import { UserData } from "../types";

export class UserService {
    async create(userData: UserData) {
        try {
            const user = await prisma.user.create({
                data: userData,
            });
            return user;
        } catch (err) {
            logger.error(err);
        }
    }
}
