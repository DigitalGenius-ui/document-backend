import { Router } from "express";
import {
  createDocumentHanlder,
  getAllDocuement,
  getSingleDocuement,
  removeDocument,
} from "../controllers/document-contorller";
import { authMiddleware } from "../middleware/authMiddleware";

const documentRoute = Router();

// /auth route

documentRoute.post("/createDocument", authMiddleware, createDocumentHanlder);
documentRoute.post(
  "/removeDocument/:documentId",
  authMiddleware,
  removeDocument
);
documentRoute.get("/getSingleDocument/:documentId", getSingleDocuement);
documentRoute.get("/getAllDocuments", getAllDocuement);
export default documentRoute;
