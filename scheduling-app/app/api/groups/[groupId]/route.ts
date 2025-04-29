import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Group } from "@/models/Group";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  await dbConnect();
  const { groupId } = await params;
  const data = await request.json();

  // Validate `data` here (e.g. ensure timezone is IANA, frequency/dayOfWeek logic, etc.)

  const updated = await Group.findByIdAndUpdate(groupId, data, {
    new: true,
    runValidators: true, // ensure schema enums/defaults are enforced
  });

  if (!updated) {
    return NextResponse.json(
      { message: `Group with id=${groupId} not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  await dbConnect();

  // 1) await params to pull out the actual id
  const { groupId } = await params;

  // 2) attempt deletion
  const deleted = await Group.findByIdAndDelete(groupId);

  // 3) if no document was found => 404
  if (!deleted) {
    return NextResponse.json(
      { message: `Group with id=${groupId} not found` },
      { status: 404 }
    );
  }

  return new Response(null, { status: 204 });
}
