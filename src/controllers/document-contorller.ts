import { z } from "zod";
import {
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from "../constants/http";
import { documentSchema } from "../Schemas/documentSchema";
import { createDocument, publicDoc } from "../services/document-service";
import appAssert from "../utils/AppAssert";
import catchError from "../utils/catchError";
import { DocNotifyModel, DocumentModel } from "../Model/Document-model";
import { UserModel } from "../Model/AuthModels";
import { Op } from "sequelize";

export const createDocumentHandler = catchError(async (req, res) => {
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

export const getAllDocuementHandler = catchError(async (req, res) => {
  const getDocs = await DocumentModel.findAll({
    include: [
      { model: UserModel, as: "user", attributes: ["email", "id", "userName"] },
    ],
    order: [["updatedAt", "DESC"]],
  });

  appAssert(getDocs, NOT_FOUND, "Failed to access docs!");
  return res.status(OK).json(getDocs);
});

export const getSingleDocuementHandler = catchError(async (req, res) => {
  const documentId = z.string().parse(req.params.documentId);

  const getSingleDoc = await DocumentModel.findOne({
    where: { [Op.or]: [{ id: documentId }, { documentId: documentId }] },
    include: [
      { model: UserModel, as: "user", attributes: ["email", "id", "userName"] },
    ],
  });

  return res.status(OK).json(getSingleDoc);
});

export const removeDocumentHandler = catchError(async (req, res) => {
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
  await DocNotifyModel.destroy({
    where: { documentId },
  });

  return res.status(OK).json({ message: "Document has been removed!" });
});

export const publishDocHandler = catchError(async (req, res) => {
  const userId = req.userId;
  appAssert(
    userId,
    UNAUTHORIZED,
    "You are not authorized to access this route"
  );

  const visibility = z
    .enum(["Public", "Private", "Draft"])
    .parse(req.body.visibility);
  const documentId = z.string().parse(req.params.documentId);

  await publicDoc({
    documentId,
    userId,
    visibility,
  });

  return res.status(OK).json({ message: "Document has been published!" });
});

export const getUserNotificationHandler = catchError(async (req, res) => {
  const userId = req.userId;
  appAssert(
    userId,
    UNAUTHORIZED,
    "You are not authorized to access this route"
  );

  const getNotification = await DocNotifyModel.findAll({});
  appAssert(
    getNotification,
    INTERNAL_SERVER_ERROR,
    "Failed to display user notification!"
  );
  return res.status(OK).json(getNotification);
});

export const openNotificationHandler = catchError(async (req, res) => {
  const documentId = z.string().parse(req.params.documentId);
  const userId = req.userId;
  appAssert(
    userId,
    UNAUTHORIZED,
    "You are not authorized to access this route"
  );

  const getNotification = await DocNotifyModel.update(
    { isOpen: true },
    { where: { documentId } }
  );

  appAssert(
    getNotification,
    INTERNAL_SERVER_ERROR,
    "Failed to get user notification!"
  );
  return res.status(OK).json(getNotification);
});
