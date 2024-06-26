import dbConnect from "@/app/Database/db.connection/dbconnection";
import User from "@/app/Database/models/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;

    const Existcursor = searchParams.get('cursor') as string;
    const limit = searchParams.get('limit') as string;

   let cursor = Existcursor  !== "0" ? Existcursor :null;
   let query =cursor ? User.find({
    $and:[
      {
        _id:{
          $lt:new mongoose.Types.ObjectId(cursor)
        }
      }
    ]
  }).sort({_id:-1}).limit(parseInt(limit)) : User.find().sort({_id:-1}).limit(parseInt(limit))
      
const result = await query.exec(); 
const lastitem = result.length === parseInt(limit)?
result[result.length-1] : null

const nextCursor = lastitem? (lastitem._id as string).toString:null

      return NextResponse.json({ message: "User result",users:result,nextCursor:nextCursor , success: true });
    }
  catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
