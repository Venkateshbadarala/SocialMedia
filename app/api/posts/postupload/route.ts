// Import necessary modules and models
import dbConnect from "@/app/Database/db.connection/dbconnection";
import User from "@/app/Database/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    console.log("Connected to database");

    // Extract user ID from the request URL
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    // Validate user ID
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Parse the request body
    const reqBody = await req.json();
    const { caption, photos } = reqBody;

    // Validate request body
    if (!caption || !photos) {
      return NextResponse.json({ error: "Caption or photos are missing" }, { status: 400 });
    }

    // Find the user by ID and add the new post to the user's posts array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { userPosts: { caption, photos } } },
      { new: true, runValidators: true }
    );

    // Handle case where user is not found
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Post saved to database");

    // Respond with success message
    return NextResponse.json({ success: true, message: "Post successfully saved" });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
