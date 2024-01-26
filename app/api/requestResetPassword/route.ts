import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        await connectMongoDB();

        const user = await User.findOne({ email })

        if(!user) {
            return NextResponse.json({message: `No account with the email ${email} exists.`}, { status: 404})
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        const expirationTime = Date.now() + 3600000;

        await User.findOneAndUpdate(
            { email },
            { resetPasswordToken: resetToken, resetPasswordExpires: expirationTime }
        );

        return NextResponse.json({ message: 'Password Reset Initiated' }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "An error occurred while processing the request: ", error }, { status: 500 }); 
    }
}