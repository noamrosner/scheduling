import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

// Update a user
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const data = await request.json();
  const updated = await User.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}

// Delete a user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  await User.findByIdAndDelete(id);
  return new Response(null, { status: 204 });
}
