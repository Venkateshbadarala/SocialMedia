import dbConnect from "@/app/Database/db.connection/dbconnection";
import User from "@/app/Database/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'; // Using uuid library to generate unique IDs
import sendEmail from "@/lib/sendEmail";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    console.log("Connected to database");
    const reqBody = await req.json();
   
    const { name, password, email } = reqBody;

    if (!name || !password || !email) {
      return NextResponse.json({ error: "Something is missing" }, { status: 400 });
    }

    const isUserExist = await User.findOne({ email });
   

    if (isUserExist) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Hashed Password:", hashedPassword);

    // Generate a unique UID
    const uid = uuidv4();
    console.log("Generated UID:", uid);

    const newUser = new User({ name, email, password: hashedPassword, uid,active:false });
    console.log("New User Object:", newUser);

    await newUser.save();
    console.log("User saved to database");

    sendEmail({emailAddress:email,emailtype:"emailvalidation",userId:newUser?._id})

    return NextResponse.json({ success: true, message: "User registered successfully" });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
