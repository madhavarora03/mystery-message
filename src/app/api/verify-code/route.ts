import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/User';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: 'User not found!',
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = user.verifyCodeExpiry > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: 'Account Verified successfully!',
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            'Verification code has expired, please sign up again to get a new code!',
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: 'Verification code is incorrect!',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        sucsess: false,
        message: 'Error verifying user',
      },
      { status: 500 }
    );
  }
}
