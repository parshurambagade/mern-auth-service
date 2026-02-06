import { ENV } from "./config/env.js";
import app from "./app.js";

const startServer = () => {
  const PORT = ENV.PORT || 3000;

  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
