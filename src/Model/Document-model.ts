import { DataTypes, JSON } from "sequelize";
import { db } from "../config/db-connection";
import { UserModel } from "./AuthModels";

export const DocumentModel = db.define(
  "documents",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    content: {
      type: DataTypes.TEXT("long"),
    },
    visibility: {
      type: DataTypes.ENUM("Pulbic", "Private", "Archived"),
      defaultValue: "Private",
    },
    documentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mentions: {
      type: JSON,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export const DocNotifyModel = db.define(
  "notification",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mentionedUser: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

DocumentModel.hasOne(DocNotifyModel);
