import { z } from "zod";
import {
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from "../constants/http";
import { documentSchema } from "../Schemas/documentSchema";
import { createDocument } from "../services/document-service";
import appAssert from "../utils/AppAssert";
import catchError from "../utils/catchError";
import { DocumentModel } from "../Model/Document-model";
import { UserModel } from "../Model/AuthModels";

export const createDocumentHanlder = catchError(async (req, res) => {
  const userId = req.userId;
  appAssert(
    userId,
    UNAUTHORIZED,
    "You are not authorized to access this route"
  );

  const { title, content, mentions, documentId, visibility } =
    documentSchema.parse(req.body);

  await createDocument({
    title,
    content,
    mentions,
    documentId,
    visibility,
    userId,
    res,
  });
});

export const getAllDocuement = catchError(async (req, res) => {
  const getDocs = await DocumentModel.findAll({
    include: [
      { model: UserModel, as: "user", attributes: ["email", "id", "userName"] },
    ],
  });

  appAssert(getDocs, NOT_FOUND, "Failed to access docs!");
  return res.status(OK).json(getDocs);
});

export const getSingleDocuement = catchError(async (req, res) => {
  const documentId = z.string().parse(req.params.documentId);

  const getSingleDoc = await DocumentModel.findOne({
    where: { documentId },
    include: [
      { model: UserModel, as: "user", attributes: ["email", "id", "userName"] },
    ],
  });

  appAssert(getSingleDoc, NOT_FOUND, "Failed to access doc!");

  return res.status(OK).json(getSingleDoc);
});

export const removeDocument = catchError(async (req, res) => {
  const userId = req.userId;
  appAssert(
    userId,
    UNAUTHORIZED,
    "You are not authorized to access this route!"
  );
  const documentId = z.string().parse(req.params.documentId);

  const removeDocument = await DocumentModel.destroy({
    where: { documentId, userId },
  });

  appAssert(removeDocument, INTERNAL_SERVER_ERROR, "Failed to remove doc!");

  return res.status(OK).json({ message: "Document has been removed!" });
});
