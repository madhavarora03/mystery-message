import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { dbConnect } from '@/lib/dbConnect';
import UserModel, { Message } from '@/models/User';
import { User } from 'next-auth';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user?.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: 'User is not accepting messages',
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json(
      {
        success: true,
        message: 'Message sent successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.log('An unexpected error occured', error);
    return Response.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
