import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { email, resetToken, newPassword } = await req.json();
        await connectMongoDB();

        const user = await User.findOne({ email });

        if(!user) {
            return NextResponse.json({ message: `No account with the email ${email} exists.`}, {status: 404});
        };

        if (user.resetPasswordToken !== resetToken || user.resetPasswordExppires < Date.now()) {
            return NextResponse.json({ message: 'Invalid or expired password reset token.'}, {status: 400});
        };

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExppires = undefined;
        await user.save();

        return NextResponse.json({ message: 'Password reset successfully!'}, {status: 200})
    } catch (error) {
        console.error("An error occurred while processing the request:", error);
        return NextResponse.json({ message: "An error occurred while processing the request" }, { status: 500 });
    }
}