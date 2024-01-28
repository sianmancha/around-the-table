import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from "next/server";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export async function POST(req: NextRequest){
    try {
        const { name, email, message, subject } = await req.json();

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_PASSWORD
            },
        } as SMTPTransport.Options);

        await transporter.sendMail({
            from: email,
            to: process.env.MY_EMAIL,
            subject: `Contact Form: ${subject}`,
            html: `
                <div class="font-sans max-w-screen-md mx-auto">
                    <h2 class="text-xl font-bold mb-4">Contact Form Submission</h2>
                    <p class="mb-2"><strong class="font-semibold">Name:</strong> ${name}</p>
                    <p class="mb-2"><strong class="font-semibold">Email:</strong> ${email}</p>
                    <p class="mb-4"><strong class="font-semibold">Message:</strong> ${message}</p>
                </div> 
            `
        });

        return NextResponse.json({ message: 'Form submitted successfully!' }, { status: 200});
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'An error occurred while submitting the form'}, { status: 500 });
    }
};
