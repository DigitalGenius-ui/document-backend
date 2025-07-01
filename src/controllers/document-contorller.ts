import { z } from "zod";
import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from "../constants/http";
import { documentSchema } from "../Schemas/documentSchema";
import appAssert from "../utils/AppAssert";
import catchError from "../utils/catchError";
import { DocNotifyModel, DocumentModel } from "../Model/Document-model";
import { UserModel } from "../Model/AuthModels";
import { Op } from "sequelize";
import { createDocument, updateDoc } from "../services/document-service";
import { io } from "../index";

// create doc
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

// get all docs
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

// get single doc
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

// remove doc
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

  const removeNotify = await DocNotifyModel.destroy({
    where: { documentId, userId: userId },
  });
  appAssert(
    removeNotify,
    INTERNAL_SERVER_ERROR,
    "Failed to remove notification!"
  );

  io.emit("removeNotify", removeNotify);

  return res.status(OK).json({ message: "Document has been removed!" });
});

// update user doc
export const updateDocHandler = catchError(async (req, res) => {
  const userId = req.userId;
  appAssert(
    userId,
    UNAUTHORIZED,
    "You are not authorized to access this route"
  );

  const body = documentSchema.parse(req.body);

  const data = {
    ...body,
    userId,
  };

  await updateDoc(data);

  return res.status(OK).json({ message: "Document has been published!" });
});

// get user notification
export const getUserNotificationHandler = catchError(async (req, res) => {
  const userId = req.userId;
  appAssert(
    userId,
    UNAUTHORIZED,
    "You are not authorized to access this route"
  );

  const userName = z.string().parse(req.params.userName);

  const getNotification = await DocNotifyModel.findAll({
    where: { mentionedUser: userName },
    order: [["updatedAt", "DESC"]],
  });
  appAssert(
    getNotification,
    INTERNAL_SERVER_ERROR,
    "Failed to display user notification!"
  );
  return res.status(OK).json(getNotification);
});

// open notification
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
