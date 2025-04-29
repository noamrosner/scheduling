import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Group } from "@/models/Group";
import { Types } from "mongoose";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  await dbConnect();
  const { groupId } = await params;

  const { userId } = (await request.json()) as { userId: string };

  const group = await Group.findById(groupId);
  if (!group) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const idx = (group.members as Types.ObjectId[]).findIndex(
    (m) => m.toString() === userId
  );

  if (idx === -1) {
    group.members.push(new Types.ObjectId(userId));
  } else {
    group.members.splice(idx, 1);
  }

  await group.save();
  return NextResponse.json(group);
}
