import dbConnect from "@/app/Database/db.connection/dbconnection";
import User from "@/app/Database/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    console.log("Connected to database");

    const reqBody = await req.json();
    console.log("Request Body:", reqBody);
    const { is_admin, active, roles } = reqBody;

    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('id');

    if (!userId || is_admin === undefined || active === undefined || !roles) {
      return NextResponse.json({ error: "Something is missing" }, { status: 400 });
    }

    const isUserExist = await User.findById(userId);
    console.log("isUserExist", isUserExist);

    if (!isUserExist) {
      return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }

    const result = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          is_admin,
          active,
          roles
        }
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }

    console.log("Updated User:", result);

    return NextResponse.json({ success: true, message: "User updated successfully" });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
