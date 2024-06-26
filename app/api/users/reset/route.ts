import dbConnect from "@/app/Database/db.connection/dbconnection";
import User from "@/app/Database/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    console.log("Connected to database");
 
    const reqBody = await req.json();
    console.log("Request Body:", reqBody);
    const { token, password } = reqBody;

    if (!password || !token) {
      return NextResponse.json({ error: "Missing password or token" }, { status: 400 });
    }

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() }, 
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 409 });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Hashed Password:", hashedPassword);

    // Update user data in the database
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "User password reset successfully" });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
