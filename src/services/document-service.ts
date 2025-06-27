import { z } from "zod";
import { CONFLICT, CREATED } from "../constants/http";
import { DocumentModel } from "../Model/Document-model";
import appAssert from "../utils/AppAssert";
import { documentSchema } from "../Schemas/documentSchema";
import { Response } from "express";

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
