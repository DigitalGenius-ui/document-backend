import { Router } from "express";
import {
  getAllUsers,
  getSingleUserHanlder,
} from "../controllers/user-controller";
import { authMiddleware } from "../middleware/authMiddleware";

const userRoute = Router();

userRoute.get("/", authMiddleware, getSingleUserHanlder);
userRoute.get("/allUsers", getAllUsers);

export default userRoute;
