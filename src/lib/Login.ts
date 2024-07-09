import bcrypt  from 'bcryptjs';
import { PrismaClient } from "@prisma/client";
import axios from 'axios';

const prisma = new PrismaClient();

export async function login(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
          where: { email },
        });
      
        if (!user) {
          throw new Error("User not found");
        }
      
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }
      
        return user;
    } catch (error:any) {
        throw new Error(error.message)
    }
  }


 export async function getBotResponse(prompt:any) {
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