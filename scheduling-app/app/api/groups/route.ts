import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Group } from "@/models/Group";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();

  const docs = await Group.find().populate("members");

  const groups = docs.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    members: doc.members.map((m: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
      typeof m === "string" ? m : m._id.toString()
    ),
    timezone: doc.timezone,
    preferredTime: doc.preferredTime,
    emailType: doc.emailType,
    frequency: doc.frequency,
    dayOfWeek: doc.dayOfWeek,
  }));

  return NextResponse.json(groups);
}

export async function POST(request: Request) {
  await dbConnect();
  const { name } = await request.json();
  const group = await Group.create({ name, members: [] });
  return NextResponse.json(group, { status: 201 });
}
