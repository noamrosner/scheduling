import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db";
import agenda from "./scheduler/agenda";
import registerNotificationJob from "./scheduler/jobs/notificationJob";
import {
  scheduleGroupJob,
  scheduleUserJob,
} from "./scheduler/jobs/scheduleHelpers";
import { User } from "./models/User";
import { Group } from "./models/Group";

async function main() {
  // 1) Connect to MongoDB
  await connectDB();

  // 2) Register your notification job
  registerNotificationJob(agenda);

  // 3) Once Agenda is ready, schedule all existing users (and groups)
  agenda.on("ready", async () => {
    console.log("Scheduling existing jobs…");

    // Users
    const users = await User.find();
    await Promise.all(users.map((u) => scheduleUserJob(agenda, u)));

    await agenda.start();
    console.log("Agenda started");
  });

  // 4) React to changes in the Users collection
  User.watch().on("change", async (change) => {
    const id = change.documentKey._id.toString();
    if (change.operationType === "delete") {
      await agenda.cancel({ name: "send notification", "data.userId": id });
      console.log(`Cancelled jobs for deleted user ${id}`);
    } else {
      const u = await User.findById(id);
      if (u) await scheduleUserJob(agenda, u);
    }
  });

  Group.watch().on("change", async (c) => {
    const id = c.documentKey._id.toString();
    const name = "send notification";
    if (c.operationType === "delete") {
      await agenda.cancel({ name, "data.groupId": id });
      console.log(`Cancelled group job ${id}`);
    } else {
      const g = await Group.findById(id);
      if (g) await scheduleGroupJob(agenda, g);
    }
  });

  // 5) Graceful shutdown
  process.on("SIGINT", () => agenda.stop());
  process.on("SIGTERM", () => agenda.stop());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
