import bcrypt  from 'bcryptjs';
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// create user
export async function POST(request:Request) {
    try {
        const {name, email, password} = await request.json();
        if (!name || !email || !password) {
            return new NextResponse('All fields are required', { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await prisma.user.create({
            data:
                {
                    name,
                    email,
                    password:hashedPassword
                }
        });

        return new NextResponse(JSON.stringify({ message: 'User created successfully', user: newUser }), { status: 200 });
    } catch (error:any) {
        return new NextResponse(JSON.stringify({ message: 'User not created' + error.message }), { status: 500 });
    }
}



// get all users
export async function GET() {
    try {
        const users = await prisma.user.findMany();
        if (!users) {
            return new NextResponse('Users not found', { status: 400 });
        }
        return new NextResponse(JSON.stringify({ message: 'User created successfully', users }), { status: 200 });
    } catch (error:any) {
        return new NextResponse(JSON.stringify({ message: 'User not created' + error.message }), { status: 500 });
    }
}
