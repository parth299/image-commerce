import { connectToDb } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {   
        const {email, password} = await request.json();
        if(!email || !password) {
            return NextResponse.json(
                {error: "Credentials are required"},
                {status: 400}
            )
        }

        await connectToDb();

        const existingUser = await User.findOne({email}); 

        if(existingUser) {
            return NextResponse.json(
                {error: "User with email already exists"},
                {status: 400}
            )
        }

        await User.create({
            email,
            password,
            role: "user"
        })

        return NextResponse.json(
            {message: "User registered successfully"},
            {status: 201}
        )

    } catch (error) {
        console.error("Registeration error ", error);
        return NextResponse.json(
            {message: "Failed to register a user"},
            {status: 501}
        )
    }
}