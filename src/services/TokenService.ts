import createHttpError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import path from "node:path";
import fs from "node:fs";
import logger from "../config/logger";
import { ENV } from "../config/env";

export class TokenService {
    generateAccessToken(payload: JwtPayload) {
        let privateKey;

        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, "../../certs/private.pem"),
            );
        } catch (err) {
            logger.error(err);
            const error = createHttpError(500, "Error reading private key!");
            throw error;
        }

        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: "auth-service",
        });

        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET!, {
            expiresIn: "1y",
            algorithm: "HS256",
            issuer: "auth-service",
            jwtid: String(payload.id),
        });

        return refreshToken;
    }
}
