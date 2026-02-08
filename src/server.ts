import app from "./app.js";
import { ENV } from "./config/env.js";
import logger from "./config/logger.js";

const startServer = () => {
  const PORT = ENV.PORT || 3000;

  try {
    app.listen(PORT, () => {
      logger.info("✅ Server is running...", { PORT });
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
