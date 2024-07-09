import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {getBotResponse} from "../../../../lib/Login";
const prisma = new PrismaClient();

interface Params {
    id: string;
}

// create message in a chat
export async function POST(request: Request, {params}:{ params: Params }) {
    try {
        const {content, sender, chatId} = await request.json();
        const id = params.id;
        
        if (!content || !sender) {
            return new NextResponse('All fields are required', { status: 400 });
        }

        if (!id) {
            return new NextResponse('Chat not found', { status: 400 });
        }

        //user prompt
        const message = await prisma.message.create({
            data: {
                content,
                sender,
                chatId
            }
        });
        console.log(message);

        const botResponse = await getBotResponse(content);
        console.log(botResponse)

        if (botResponse === null) {
            return new NextResponse(JSON.stringify({ message: 'Bot response is null' }), { status: 500 });
        }

        await prisma.message.create({
            data:{
                content: botResponse,
                sender: 'bot',
                chatId: parseInt(id, 10)
            }
        });

        return new NextResponse(JSON.stringify({ message, botResponse }), { status: 200 });
    } catch (error:any) {
        return new NextResponse(JSON.stringify({ message: 'Message not created' + error.message }), { status: 500 });
    }
}

// all messages of a chat
export async function GET(request: Request,{params}:{ params: Params }) {
    try {

        const id = params.id;
        
        if (!id) {
            return new NextResponse('Chat not found', { status: 400 });
        }

        const messages = await prisma.message.findMany({
            where: {chatId: parseInt(id, 10)}
        });

        return new NextResponse(JSON.stringify({ message: 'All Messages found', messages }), { status: 200 });
    } catch (error:any) {
        return new NextResponse(JSON.stringify({ message: 'Messages not found ' + error.message }), { status: 500 });
    }
}