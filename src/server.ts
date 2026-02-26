import app from "./app.js";
import { ENV } from "./config/env.js";
import logger from "./config/logger.js";
import { prisma } from "./config/prisma.js";

const startServer = async () => {
    const PORT = ENV.PORT || 3000;

    try {
        await prisma.$connect();
        logger.info("✅ Database connected");

        app.listen(PORT, () => {
            logger.info("✅ Server is running...", { PORT });
        });
    } catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
    }
};

await startServer();
