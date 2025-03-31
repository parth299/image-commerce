import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import { connectToDb } from "@/lib/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
            .update(body)
            .digest("hex");

        if(signature !== expectedSignature) {
            return NextResponse.json({error: "Invalid Signature"}, {status: 400});
        }

        const event = JSON.parse(body);
        await connectToDb();

        if(event.event === "payment.captured") {
            const payment = event.payload.payment.entity;

            const order = await Order.findOneAndUpdate(
                {razorpayOrderId: payment.order_id},
                {
                    razorpayPaymentId: payment.id,
                    status: "completed",
                }
            )
            .populate([
                {path: "productId", select: "name"},
                {path: "userId", select: "email"}
            ])

            if(order) {
                const transporter = nodemailer.createTransport({
                    service: "sandbox.smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                        
                    }
                })
            }
        }
        
        
    } catch (error) {
        
    }
}