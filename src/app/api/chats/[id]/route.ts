
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Params {
    id: string;
}

// create chat
export async function POST(request: Request, {params}:{ params: Params }) {
    try {
        const id = params.id;
        
        if (!id) {
            return new NextResponse('User not found', { status: 400 });
        }

        const chat = await prisma.chat.create({
            data: {userId: parseInt(id, 10)}
        });

        return new NextResponse(JSON.stringify({ chat, messages: [] }), { status: 200 });
    } catch (error:any) {
        return new NextResponse(JSON.stringify({ message: 'Chat not created' + error.message }), { status: 500 });
    }
}

// all chats of a user
export async function GET(request: Request,{params}:{ params: Params }) {
    try {

        const id = params.id;
        
        if (!id) {
            return new NextResponse('User not found', { status: 400 });
        }

        const chats = await prisma.chat.findMany({
            where: {userId: parseInt(id, 10)}
        });

        return new NextResponse(JSON.stringify({ message: 'All Chats found', chats }), { status: 200 });
    } catch (error:any) {
        return new NextResponse(JSON.stringify({ message: 'Chats not found ' + error.message }), { status: 500 });
    }
}

// delete chat
export async function DELETE(request: Request, { params }: { params: Params }) {
    try {
        const id = parseInt(params.id);

        if (!id) {
            return new NextResponse('Chat not found', { status: 400 });
        }

        const deletedChat = await prisma.chat.delete({
            where: { id },
        });

        return new NextResponse(JSON.stringify({ message: 'Chat deleted successfully', deletedChat }), { status: 200 });
    } catch (err: any) {
        return new NextResponse('Error in deleting chat: ' + err.message, { status: 500 });
    }
}