import bcrypt  from 'bcryptjs';
import { PrismaClient } from "@prisma/client";

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