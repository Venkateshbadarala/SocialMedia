import  mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
    {
        provider:{
            type: String,
            required:true
        },
        providerAccountId:{
            type: String,
            required:true
        },
        type:{
            type: String,
            required:true
        },
        access_token:{
            type: String,
            required:true
        },
        expiresAt:{
            type: Date,
           
        },
        scope:{
            type: String,
           
        },
        token_type:{
            type: String,
           
        },
        id_token:{
            type: String,
           
        },
        userid:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
           
        },

    }
)