import { Router } from "express";
import {
  createDocumentHandler,
  getAllDocuementHandler,
  getSingleDocuementHandler,
  getUserNotificationHandler,
  openNotificationHandler,
  updateDocHandler,
  removeDocumentHandler,
} from "../controllers/document-contorller";
import { authMiddleware } from "../middleware/authMiddleware";

const documentRoute = Router();

// auth route
documentRoute.post("/createDocument", authMiddleware, createDocumentHandler);
documentRoute.post(
  "/removeDocument/:documentId",
  authMiddleware,
  removeDocumentHandler
);
documentRoute.post("/updateDoc", authMiddleware, updateDocHandler);

documentRoute.get(
  "/userNotification/:userName",
  authMiddleware,
  getUserNotificationHandler
);
documentRoute.post(
  "/openNotification/:documentId",
  authMiddleware,
  openNotificationHandler
);

documentRoute.get("/getSingleDocument/:documentId", getSingleDocuementHandler);
documentRoute.get("/getAllDocuments", getAllDocuementHandler);
export default documentRoute;
