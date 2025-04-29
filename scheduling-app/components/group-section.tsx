"use client";

import { useState, FormEvent } from "react";
import moment from "moment-timezone";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Group,
  User,
  EmailType,
  ScheduleFrequency,
  DayOfWeek,
} from "@/types/types";

// Build dropdown options
const tzOptions = moment.tz.names().map((tz) => ({ label: tz, value: tz }));
const emailTypeOptions: { label: string; value: EmailType }[] = [
  { label: "Daily Summary", value: "daily-summary" },
  { label: "Weekly Report", value: "weekly-report" },
  { label: "Activity Alert", value: "activity-alert" },
  { label: "Promo", value: "promo" },
  { label: "System Reminder", value: "system-reminder" },
];
const frequencyOptions: { label: string; value: ScheduleFrequency }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
];
const daysOfWeek: DayOfWeek[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface GroupSectionProps {
  groups: Group[];
  users: User[];
  onCreateGroup: (
    name: string,
    timezone: string,
    preferredTime: string,
    emailType: EmailType,
    frequency: ScheduleFrequency,
    dayOfWeek?: DayOfWeek
  ) => Promise<void>;
  onUpdateGroup: (
    id: string,
    name: string,
    timezone: string,
    preferredTime: string,
    emailType: EmailType,
    frequency: ScheduleFrequency,
    dayOfWeek?: DayOfWeek
  ) => Promise<void>;
  onDeleteGroup: (id: string) => Promise<void>;
  onToggleMember: (groupId: string, userId: string) => Promise<void>;
}

export default function GroupSection({
  groups,
  users,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
  onToggleMember,
}: GroupSectionProps) {
  // Create form state
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [preferredTime, setPreferredTime] = useState("09:00");
  const [emailType, setEmailType] = useState<EmailType>("daily-summary");
  const [frequency, setFrequency] = useState<ScheduleFrequency>("daily");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>("Monday");

  // Edit form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTimezone, setEditTimezone] = useState("");
  const [editPreferredTime, setEditPreferredTime] = useState("09:00");
  const [editEmailType, setEditEmailType] =
    useState<EmailType>("daily-summary");
  const [editFrequency, setEditFrequency] =
    useState<ScheduleFrequency>("daily");
  const [editDayOfWeek, setEditDayOfWeek] = useState<DayOfWeek>("Monday");

  // Disable buttons if required values missing
  const isCreateDisabled =
    !name.trim() ||
    !timezone ||
    !preferredTime ||
    !emailType ||
    !frequency ||
    (frequency === "weekly" && !dayOfWeek);

  const isSaveDisabled =
    !editName.trim() ||
    !editTimezone ||
    !editPreferredTime ||
    !editEmailType ||
    !editFrequency ||
    (editFrequency === "weekly" && !editDayOfWeek);

  // Create handler
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (isCreateDisabled) return;
    await onCreateGroup(
      name,
      timezone,
      preferredTime,
      emailType,
      frequency,
      frequency === "weekly" ? dayOfWeek : undefined
    );
    setName("");
    setTimezone("");
    setPreferredTime("09:00");
    setEmailType("daily-summary");
    setFrequency("daily");
    setDayOfWeek("Monday");
  };

  // Begin editing a group
  const startEdit = (g: Group) => {
    setEditingId(g.id);
    setEditName(g.name);
    setEditTimezone(g.timezone);
    setEditPreferredTime(g.preferredTime);
    setEditEmailType(g.emailType);
    setEditFrequency(g.frequency);
    setEditDayOfWeek(g.dayOfWeek ?? "Monday");
  };

  // Save edits
  const handleSave = async () => {
    if (!editingId || isSaveDisabled) return;
    await onUpdateGroup(
      editingId,
      editName,
      editTimezone,
      editPreferredTime,
      editEmailType,
      editFrequency,
      editFrequency === "weekly" ? editDayOfWeek : undefined
    );
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Groups</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create Form */}
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 items-end"
        >
          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-name">Name</Label>
            <Input
              id="new-name"
              placeholder="Group Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Timezone */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-tz">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue placeholder="Timezone" />
              </SelectTrigger>
              <SelectContent>
                {tzOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Time */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-time">Time</Label>
            <Input
              id="new-time"
              type="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
            />
          </div>

          {/* Email Type */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-emailType">Email Type</Label>
            <Select
              value={emailType}
              onValueChange={(v) => setEmailType(v as EmailType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {emailTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Frequency */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-frequency">Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(v) => setFrequency(v as ScheduleFrequency)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Freq" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Day of Week (if weekly) */}
          {frequency === "weekly" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-day">Day</Label>
              <Select
                value={dayOfWeek}
                onValueChange={(v) => setDayOfWeek(v as DayOfWeek)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" disabled={isCreateDisabled}>
            Add Group
          </Button>
        </form>

        {/* Groups Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Timezone</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Email Type</TableHead>
              <TableHead>Freq</TableHead>
              <TableHead>Day</TableHead>
              <TableHead className="text-right">Members</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((g) => (
              <TableRow key={g.id}>
                {editingId === g.id ? (
                  <>
                    <TableCell>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={editTimezone}
                        onValueChange={setEditTimezone}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tzOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        value={editPreferredTime}
                        onChange={(e) => setEditPreferredTime(e.target.value)}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={editEmailType}
                        onValueChange={(v) => setEditEmailType(v as EmailType)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {emailTypeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={editFrequency}
                        onValueChange={(v) =>
                          setEditFrequency(v as ScheduleFrequency)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {editFrequency === "weekly" ? (
                        <Select
                          value={editDayOfWeek}
                          onValueChange={(v) =>
                            setEditDayOfWeek(v as DayOfWeek)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {daysOfWeek.map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        {users.map((u) => (
                          <Button
                            key={u.id}
                            variant={
                              g.members.includes(u.id) ? "default" : "outline"
                            }
                            onClick={() => onToggleMember(g.id, u.id)}
                          >
                            {u.email}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaveDisabled}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{g.name}</TableCell>
                    <TableCell>{g.timezone}</TableCell>
                    <TableCell>{g.preferredTime}</TableCell>
                    <TableCell>
                      {
                        emailTypeOptions.find(
                          (opt) => opt.value === g.emailType
                        )?.label
                      }
                    </TableCell>
                    <TableCell>
                      {
                        frequencyOptions.find(
                          (opt) => opt.value === g.frequency
                        )?.label
                      }
                    </TableCell>
                    <TableCell>
                      {g.frequency === "weekly" ? g.dayOfWeek : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        {users.map((u) => (
                          <Button
                            key={u.id}
                            variant={
                              g.members.includes(u.id) ? "default" : "outline"
                            }
                            onClick={() => onToggleMember(g.id, u.id)}
                          >
                            {u.email}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" onClick={() => startEdit(g)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteGroup(g.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
