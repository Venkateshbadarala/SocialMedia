import dbConnect from "@/app/Database/db.connection/dbconnection";
import User from "@/app/Database/models/user";
import { NextRequest, NextResponse } from "next/server";
import sendEmail from "@/lib/sendEmail";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    console.log("Connected to database");
    const reqBody = await req.json();
    console.log("Request Body:", reqBody);
    const {email } = reqBody;
   
    if (!email) {
      return NextResponse.json({ error: "Something is missing" }, { status: 400 });
    }

    const isUserExist = await User.findOne({ email });
   

    if (!isUserExist) {
      return NextResponse.json({ error: "User not found" }, { status: 409 });
    }
   sendEmail({emailAddress:email,emailtype:"forgotPassword",userId:isUserExist?._id})

    return NextResponse.json({ success: true, message: "validation email send successfully" });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
