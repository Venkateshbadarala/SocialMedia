import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/Database/db.connection/dbconnection';
import User from '@/app/Database/models/user';
import bcrypt from 'bcrypt';
import cloudinary from '@/app/Database/cloudinary.config';

interface UpdateData {
    name?: string;
    email?: string;
    password?: string;
    image?: string;
}

export async function POST(req: NextRequest) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');
    console.log(userId);

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const { name, email, password, image } = body;
    console.log(image);

    const updateData: UpdateData = {};
    if (typeof name === 'string' && name) updateData.name = name;
    if (typeof email === 'string' && email) updateData.email = email;

    if (typeof image === 'string' && image) {
        try {
            const uploadedResponse = await cloudinary.uploader.upload(image, {
                folder: 'user_profiles',
            });
            updateData.image = uploadedResponse.secure_url;
        } catch (error) {
            return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
        }
    }

    if (typeof password === 'string' && password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
    }

    try {
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        console.log(user);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
