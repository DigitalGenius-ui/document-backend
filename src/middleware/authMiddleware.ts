import { RequestHandler } from "express";
import appAssert from "../utils/AppAssert";
import { UNAUTHORIZED } from "../constants/http";
import { AppErrorCode } from "../constants/AppErrorCode";
import { verifyToken } from "../utils/JWTToken";

export const authMiddleware: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Access token is not found",
    AppErrorCode.TOKEN_NOT_FOUND
  );

  // TODO: must fix the verifyToken erro if the token is invalid

  const { payload, error } = verifyToken(accessToken, "accessToken");
  appAssert(
    !error,
    UNAUTHORIZED,
    "Access token is invalid!",
    AppErrorCode.INVALID_TOKEN
  );

  req.userId = payload?.user_id;
  req.sessionId = payload?.sessionId;

  next();
};
