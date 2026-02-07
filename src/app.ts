import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import type { HttpError } from "http-errors";
import logger from "./config/logger.js";
import createHttpError from "http-errors";

const app: express.Application = express();

app.get("/", (req, res) => {
  const err = createHttpError(401, "Unauthorized Access");
  throw err;
  res.send("Hello, World!");
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(error.message);
  const statusCode = error.status || 500;

  res.status(statusCode).json({
    errors: [
      {
        type: error.name,
        path: "",
        message: error.message,
        location: "",
      },
    ],
  });
});
export default app;
