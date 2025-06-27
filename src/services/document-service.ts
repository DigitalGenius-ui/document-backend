import { z } from "zod";
import { CONFLICT, CREATED, NOT_FOUND } from "../constants/http";
import { DocNotifyModel, DocumentModel } from "../Model/Document-model";
import appAssert from "../utils/AppAssert";
import { documentSchema } from "../Schemas/documentSchema";
import { Response } from "express";
import { UserModel } from "../Model/AuthModels";

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
    where: { documentId: documentId, userId },
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
    const updateDocument = await isDocuemntExist.update({
      title,
      content,
      mentions,
      documentId,
      userId,
      visibility,
      updatedAt: new Date(),
    });
    appAssert(updateDocument, CONFLICT, "Failed to update document!");
    return res.status(CREATED).json({ message: "Document has been updated!!" });
  }
};

type publicDocType = {
  documentId: string;
  userId: string;
  visibility: "Public" | "Private" | "Draft";
};
// publish document
export const publicDoc = async ({
  documentId,
  userId,
  visibility,
}: publicDocType) => {
  const user = await UserModel.findOne({ where: { id: userId } });
  // find the doc
  const findDoc = await DocumentModel.findOne({ where: { documentId } });
  appAssert(findDoc, NOT_FOUND, "Failed to find document!");

  console.log(findDoc);

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
      const snedNotify = await DocNotifyModel.create({
        title: `You have recived notification from @${user?.dataValues.userName}`,
        mentionedUser: name,
        documentId: findDoc.dataValues.documentId,
      });
      appAssert(snedNotify, CONFLICT, "Failed to send Notification!");
    });
  }
  // change the visibiliy
  const publishDoc = await findDoc.update({
    visibility,
    updatedAt: new Date(),
    mentions,
  });
  return { publishDoc };
};
