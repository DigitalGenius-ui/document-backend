import { z } from "zod";
import { CONFLICT, CREATED, NOT_FOUND, OK } from "../constants/http";
import { DocNotifyModel, DocumentModel } from "../Model/Document-model";
import appAssert from "../utils/AppAssert";
import { documentSchema } from "../Schemas/documentSchema";
import { Response } from "express";
import { UserModel } from "../Model/AuthModels";
import { io } from "../index";

type createDocType = z.infer<typeof documentSchema> & {
  userId: string;
  res: Response;
};

export const createDocument = async ({
  title,
  content,
  mentions,
  documentId,
  userId,
  res,
  visibility,
}: createDocType) => {
  const isDocuemntExist = await DocumentModel.findOne({
    where: { documentId, userId },
  });

  if (!isDocuemntExist) {
    const createDocument = await DocumentModel.create({
      title,
      content,
      mentions,
      documentId,
      visibility,
      userId,
    });

    appAssert(createDocument, CONFLICT, "Failed to create document!");
    return res.status(CREATED).json({ message: "Document has been created!!" });
  } else {
    const updateData = await isDocuemntExist.update({
      title,
      content,
      mentions,
      visibility,
      updatedAt: new Date(),
    });
    appAssert(updateData, CONFLICT, "Failed to update document!");
    return res.status(CREATED).json({ message: "Document has been upcated!!" });
  }
};

type updateDocType = {
  title?: string;
  content?: string;
  mentions?: string[];
  documentId: string;
  userId: string;
  visibility?: "Public" | "Private" | "Draft";
};

// update document
export const updateDoc = async (data: updateDocType) => {
  const { visibility, title, userId, documentId } = data;

  const user = await UserModel.findOne({ where: { id: userId } });

  // find the doc
  const findDoc = await DocumentModel.findOne({
    where: { documentId, userId },
  });

  appAssert(findDoc, NOT_FOUND, "Failed to find document!");

  // check if it has mentions
  const { mentions } = findDoc.dataValues;

  // check if they have already recived the notification
  if (mentions.length > 0 && visibility === "Public") {
    mentions.map(async (name: string) => {
      const notified = await DocNotifyModel.findOne({
        where: { mentionedUser: name, documentId },
      });

      if (notified) return;
      // if not then send them a notification.
      const sendNotify = await DocNotifyModel.create({
        title: `You have recived notification from @${user?.dataValues.userName}`,
        mentionedUser: name,
        documentId: findDoc.dataValues.documentId,
        userId,
      });
      appAssert(sendNotify, CONFLICT, "Failed to send Notification!");

      io.emit("removeNotify", { message: "Notification removed!" });
    });
  }
  // update the doc.
  const updatedDoc = await findDoc.update({
    visibility,
    updatedAt: new Date(),
    mentions,
    title,
  });

  appAssert(updatedDoc, CONFLICT, "Failed to update the doc!");
  return { updatedDoc };
};
