import "dotenv/config";
import express from "express";
import { APP_ORIGIN, ENDPOINT_PORT } from "./constants/env";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import authRoute from "./routes/auth-route";
import userRoute from "./routes/user-route";
import { authMiddleware } from "./middleware/authMiddleware";
import sessionRoute from "./routes/session-route";
import documentRoute from "./routes/document-route";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

// socket.io config
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// middlewares
app.use(express.json());
// to pass form data
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: APP_ORIGIN, credentials: true }));
app.use(cookieParser());

// app routes
app.use("/auth", authRoute);
app.use("/document", documentRoute);

//protected routes
app.use("/user", userRoute);
app.use("/session", authMiddleware, sessionRoute);

// error handler
app.use(errorHandler);

server.listen(ENDPOINT_PORT, () => {
  console.log(`Server is running in port ${ENDPOINT_PORT}`);
});
