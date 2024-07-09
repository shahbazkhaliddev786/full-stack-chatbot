import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
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

        async function getBotResponse(prompt:any) {
            try {
                console.log("try one")
              const response = await axios.post(
                'https://api.together.xyz/inference',
                {
                  model: 'togethercomputer/llama-2-70b-chat',
                  max_tokens: 3000,
                  prompt: prompt,
                  request_type: 'language-model-inference',
                  temperature: 0.7,
                  top_p: 0.7,
                  top_k: 50,
                  repetition_penalty: 1,
                  stop: ['[/INST]', '</s>'],
                  negative_prompt: '',
                  sessionKey: '13daeea5-9e6f-4b1d-b1ba-a7e13e3b727b',
                },
                {
                  headers: {
                    Authorization: 'Bearer 8cc8b6a21bca579e2bea732923c5aa8d5362655f7438de4e2e8020f1670d8df5',
                  },
                }
              );
              return response.data.output.choices[0].text;
            } catch (error) {
              console.error('Error getting bot response:', error);
              return 'Sorry, I am unable to respond at the moment.';
            }
        }

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