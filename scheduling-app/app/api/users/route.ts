import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import type { ScheduleFrequency, DayOfWeek } from "@/types/types";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();

  // Fetch all users
  const docs = await User.find();

  const users = docs.map((doc) => {
    const json = doc.toJSON() as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    return {
      id: json._id,
      email: json.email,
      timezone: json.timezone,
      preferredTime: json.preferredTime,
      emailType: json.emailType,
      frequency: json.frequency,
      dayOfWeek: json.frequency === "weekly" ? json.dayOfWeek : undefined,
    };
  });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    // Pull in your new fields
    const {
      email,
      timezone,
      preferredTime,
      emailType,
      frequency,
      dayOfWeek,
    }: {
      email: string;
      timezone: string;
      preferredTime: string;
      emailType: string;
      frequency: ScheduleFrequency;
      dayOfWeek?: DayOfWeek;
    } = await request.json();

    // Validate required basics + weekly/dayOfWeek
    if (
      !email ||
      !timezone ||
      !preferredTime ||
      !emailType ||
      !frequency ||
      (frequency === "weekly" && !dayOfWeek)
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Duplicate‐email check
    if (await User.findOne({ email })) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    // Create! Mongoose schema defaults fill in any omitted optionals.
    const user = await User.create({
      email,
      timezone,
      preferredTime,
      emailType,
      frequency,
      dayOfWeek,
    });

    // The created doc will include your virtual `id` in the JSON
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error("POST /api/users error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
