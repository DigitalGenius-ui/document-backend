import { Op } from "sequelize";
import { NOT_FOUND, OK, UNAUTHORIZED } from "../constants/http";
import { UserModel } from "../Model/AuthModels";
import { getUserById } from "../services/user-service";
import appAssert from "../utils/AppAssert";
import catchError from "../utils/catchError";

export const getSingleUserHanlder = catchError(async (req, res) => {
  const userId = req.userId as string;
  const user = await getUserById(userId);

  return res.status(OK).json(user);
});

export const getAllUsers = catchError(async (req, res) => {
  const userId = req.userId;
  appAssert(
    userId,
    UNAUTHORIZED,
    "You are not authorized to access this route!"
  );

  const users = await UserModel.findAll({
    where: {
      id: {
        [Op.ne]: userId,
      },
    },
  });
  appAssert(users, NOT_FOUND, "Failed to find users!");

  return res.status(OK).json(users);
});
