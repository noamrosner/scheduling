import { Schema, model, models, Document, Types } from "mongoose";

export interface ISentEmail extends Document {
  user?: Types.ObjectId;
  group?: Types.ObjectId;
  emailType: string;
  sentAt: Date;
}

const SentEmailSchema = new Schema<ISentEmail>({
  user: { type: Types.ObjectId, ref: "User" },
  group: { type: Types.ObjectId, ref: "Group" },
  emailType: { type: String, required: true },
  sentAt: { type: Date, required: true, default: () => new Date() },
});

export const SentEmail =
  models.SentEmail || model<ISentEmail>("SentEmail", SentEmailSchema);
