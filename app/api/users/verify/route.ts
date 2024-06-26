import dbConnect from "@/app/Database/db.connection/dbconnection";
import User from "@/app/Database/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;

    const tokenType = searchParams.get("type");
    const token = searchParams.get("token");

    if (!tokenType || !token) {
      return NextResponse.json({ error: "Missing token or token type" }, { status: 400 });
    }

    let user;
    if (tokenType === "emailvalidation") {
      user = await User.findOne({
        verifyToken: token,
        verifyTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found or token expired" }, { status: 404 });
      }

      user.active = true;
      user.verifyToken = undefined;
      user.verifyTokenExpiry = undefined;
      await user.save();

      const loginUrl = `${process.env.NEXTAUTH_URL}/login`;
      return NextResponse.redirect(loginUrl);
    } else if (tokenType === "forgotPassword") {
      user = await User.findOne({
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found or token expired" }, { status: 404 });
      }

      await user.save();

      const resetPasswordUrl = `${process.env.NEXTAUTH_URL}/reset?token=${token}&verified=true`;
      return NextResponse.redirect(resetPasswordUrl);
    } else {
      return NextResponse.json({ error: "Invalid token type" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
