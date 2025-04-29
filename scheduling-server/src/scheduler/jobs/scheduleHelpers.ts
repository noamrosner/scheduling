import { Agenda } from "agenda";
import { Group, User } from "../../types/types";

// Build a cron expression for daily or weekly
export function buildCron(
  frequency: User["frequency"],
  preferredTime: string,
  dayOfWeek?: User["dayOfWeek"]
): string {
  const [hourStr, minStr] = preferredTime.split(":");
  const hour = parseInt(hourStr, 10);
  const min = parseInt(minStr, 10);

  if (frequency === "daily") {
    return `${min} ${hour} * * *`;
  } else {
    // Sunday=0, Monday=1, ... Saturday=6
    const dowMap: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const day = dayOfWeek ? dowMap[dayOfWeek] : 1;
    return `${min} ${hour} * * ${day}`;
  }
}

// Schedule / reschedule a user job
export async function scheduleUserJob(agenda: Agenda, user: User) {
  const name = "send notification";
  const cron = buildCron(user.frequency, user.preferredTime, user.dayOfWeek);

  // 1) cancel any existing job for this user
  await agenda.cancel({ name, "data.userId": user.id });

  // 2) re-insert it
  await agenda.every(
    cron,
    name,
    { userId: user.id },
    { timezone: user.timezone, skipImmediate: true }
  );
  console.log(`[User] ${user.email} → ${cron} [${user.timezone}]`);
}

export async function scheduleGroupJob(agenda: Agenda, group: Group) {
  const name = "send notification";
  // reuse your buildCron helper
  const cron = buildCron(
    group.frequency,
    group.preferredTime,
    group.frequency === "weekly" ? group.dayOfWeek : undefined
  );

  // 1) cancel any existing job for this group
  await agenda.cancel({ name, "data.groupId": group.id });

  // 2) re-insert it
  await agenda.every(
    cron,
    name,
    { groupId: group.id },
    { timezone: group.timezone, skipImmediate: true }
  );
  console.log(`[Group] ${group.name} → ${cron} [${group.timezone}]`);
}
