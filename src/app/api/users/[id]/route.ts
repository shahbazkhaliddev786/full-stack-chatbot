import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Params {
    id: string;
}

// update
export async function PATCH(request: Request, {params}:{ params: Params }){
    try{
        const data = await request.json();

        if (!data) {
            return new NextResponse('All fields are required', { status: 400 });
        }

        const id = parseInt(params.id);
        
        if (!id) {
            return new NextResponse('User not found', { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: {id},
            data
        });

        return new NextResponse(JSON.stringify({ message: 'User updated successfully', user: updatedUser }), { status: 200 });
    }catch(err:any){
      return new NextResponse('Error in updating user: ' + err.message, { status: 500 });
    }
}

// delete
export async function DELETE(request: Request, { params }: { params: Params }) {
    try {
        const id = parseInt(params.id);

        if (!id) {
            return new NextResponse('User not found', { status: 400 });
        }

        const deletedUser = await prisma.user.delete({
            where: { id },
        });

        return new NextResponse(JSON.stringify({ message: 'User deleted successfully', user: deletedUser }), { status: 200 });
    } catch (err: any) {
        return new NextResponse('Error in deleting user: ' + err.message, { status: 500 });
    }
}