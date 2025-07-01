import { DataTypes, JSON } from "sequelize";
import { db } from "../config/db-connection";

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
      type: DataTypes.ENUM("Public", "Private", "Draft"),
      defaultValue: "Draft",
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
  "notifications",
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    isOpen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);
