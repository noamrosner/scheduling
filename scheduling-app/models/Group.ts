import { Schema, model, models, Types } from "mongoose";
import moment from "moment-timezone";

const GroupSchema = new Schema({
  name: { type: String, required: true, unique: true },
  members: [{ type: Types.ObjectId, ref: "User" }],
  timezone: {
    type: String,
    required: true,
    enum: moment.tz.names(), // only valid IANA zones
    default: moment.tz.guess(), // auto-detect the server’s zone
  },
  preferredTime: {
    type: String,
    required: true,
    default: "09:00",
  },
  emailType: {
    type: String,
    enum: [
      "daily-summary",
      "weekly-report",
      "activity-alert",
      "promo",
      "system-reminder",
    ],
    required: true,
    default: "daily-summary",
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly"],
    required: true,
    default: "daily",
  },
  dayOfWeek: {
    type: String,
    enum: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    // only meaningful when frequency==='weekly'
    default: "Monday",
  },
});
export const Group = models.Group || model("Group", GroupSchema);
