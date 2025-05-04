"use client";

import { useState, useEffect } from "react";
import LoginForm from "@/components/login-form";
import UsersSection from "@/components/user-section";
import GroupSection from "@/components/group-section";
import {
  User,
  Group,
  EmailType,
  ScheduleFrequency,
  DayOfWeek,
} from "@/types/types";
import { Button } from "@/components/ui/button";
import SingleAddUserSection from "@/components/single-add-user-section";

export default function HomePage() {
  const [authenticated, setAuthenticated] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  // fetchers
  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    setUsers(await res.json());
  };
  const fetchGroups = async () => {
    const res = await fetch("/api/groups");
    setGroups(await res.json());
  };

  useEffect(() => {
    if (authenticated) {
      fetchUsers();
      fetchGroups();
    }
  }, [authenticated]);

  // Users handlers
  // Create user with frequency & optional dayOfWeek
  const onCreateUser = async (
    email: string,
    timezone: string,
    preferredTime: string,
    emailType: EmailType,
    frequency: ScheduleFrequency,
    dayOfWeek?: DayOfWeek
  ) => {
    // Build payload, include dayOfWeek only when weekly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      email,
      timezone,
      preferredTime,
      emailType,
      frequency,
    };
    if (frequency === "weekly" && dayOfWeek) {
      payload.dayOfWeek = dayOfWeek;
    }

    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await fetchUsers();
  };

  // Update user with frequency & optional dayOfWeek
  const onUpdateUser = async (
    id: string,
    email: string,
    timezone: string,
    preferredTime: string,
    emailType: EmailType,
    frequency: ScheduleFrequency,
    dayOfWeek?: DayOfWeek
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      email,
      timezone,
      preferredTime,
      emailType,
      frequency,
    };
    if (frequency === "weekly" && dayOfWeek) {
      payload.dayOfWeek = dayOfWeek;
    }

    await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await fetchUsers();
  };

  const onDeleteUser = async (id: string) => {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    await fetchUsers();
    await fetchGroups();
  };

  // Groups handlers
  const onCreateGroup = async (
    name: string,
    timezone: string,
    preferredTime: string,
    emailType: EmailType,
    frequency: ScheduleFrequency,
    dayOfWeek?: DayOfWeek
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      name,
      timezone,
      preferredTime,
      emailType,
      frequency,
    };
    if (frequency === "weekly" && dayOfWeek) payload.dayOfWeek = dayOfWeek;

    await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await fetchGroups();
  };

  const onUpdateGroup = async (
    id: string,
    name: string,
    timezone: string,
    preferredTime: string,
    emailType: EmailType,
    frequency: ScheduleFrequency,
    dayOfWeek?: DayOfWeek
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      name,
      timezone,
      preferredTime,
      emailType,
      frequency,
    };
    if (frequency === "weekly" && dayOfWeek) payload.dayOfWeek = dayOfWeek;

    await fetch(`/api/groups/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await fetchGroups();
  };

  const onDeleteGroup = async (id: string) => {
    await fetch(`/api/groups/${id}`, { method: "DELETE" });
    await fetchGroups();
  };

  const onToggleMember = async (groupId: string, userId: string) => {
    await fetch(`/api/groups/${groupId}/members`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    await fetchGroups();
  };

  const onRefresh = () => {
    fetchUsers();
    fetchGroups();
  };

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Refresh button */}
      <div className="flex justify-end">
        <Button onClick={onRefresh}>Refresh</Button>
      </div>

      <SingleAddUserSection onCreateUser={onCreateUser} />
      <UsersSection
        users={users}
        onCreateUser={onCreateUser}
        onDeleteUser={onDeleteUser}
        onUpdateUser={onUpdateUser}
      />
      <GroupSection
        groups={groups}
        users={users}
        onCreateGroup={onCreateGroup}
        onDeleteGroup={onDeleteGroup}
        onUpdateGroup={onUpdateGroup}
        onToggleMember={onToggleMember}
      />
    </div>
  );
}
