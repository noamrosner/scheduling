// src/scheduler/jobs/notificationJob.ts
import { Agenda, Job } from "agenda";
import moment from "moment-timezone";
import { User } from "../../models/User";
import { Group } from "../../models/Group";
import { SentEmail } from "../../models/SentEmail";
import sendEmail from "../../services/emailService";

interface JobData {
  userId?: string;
  groupId?: string;
}

export default function registerNotificationJob(agenda: Agenda) {
  agenda.define<JobData>(
    "send notification",
    { concurrency: 5 },
    async (job: Job<JobData>) => {
      const { userId, groupId } = job.attrs.data;

      // Per User
      if (userId) {
        const u = await User.findById(userId);
        if (!u) return;

        // Skip if already sent today
        const now = moment().tz(u.timezone);
        const startOfDay = now.clone().startOf("day").toDate();
        const endOfDay = now.clone().endOf("day").toDate();
        const alreadyUser = await SentEmail.findOne({
          user: u._id,
          emailType: u.emailType,
          sentAt: { $gte: startOfDay, $lt: endOfDay },
        });
        if (alreadyUser) return;

        // Send & log
        const subject = `Your ${u.emailType}`;
        const body = `Hello ${u.email}, this is your ${u.emailType}!`;
        await sendEmail(u.email, subject, body);
        await SentEmail.create({ user: u._id, emailType: u.emailType });
        return;
      }

      // Per Group
      if (groupId) {
        const g = await Group.findById(groupId).populate("members");
        if (!g) return;

        const subject = `Group '${g.name}' notification`;
        const now = moment().tz(g.timezone);
        const startOfDay = now.clone().startOf("day").toDate();
        const endOfDay = now.clone().endOf("day").toDate();

        for (const member of g.members as any[]) {
          // skip if already sent today for this member+group
          const alreadyGroup = await SentEmail.findOne({
            user: member._id,
            group: g._id,
            emailType: "group-notification",
            sentAt: { $gte: startOfDay, $lt: endOfDay },
          });
          if (alreadyGroup) continue;

          const body = `Hello ${member.email}, this is your group '${g.name}' alert.`;
          await sendEmail(member.email, subject, body);
          await SentEmail.create({
            user: member._id,
            group: g._id,
            emailType: "group-notification",
          });
        }
      }
    }
  );
}
