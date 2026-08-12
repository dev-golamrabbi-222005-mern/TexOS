import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import UserOTP from '@/lib/db/models/UserOTP';
import { requestOtpSchema } from '@/lib/validations/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = requestOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Invalid phone number' },
        { status: 400 }
      );
    }

    const { phone } = parsed.data;

    await connectDB();

    const user = await User.findOne({ phone });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No registered account found with this phone number' },
        { status: 404 }
      );
    }

    if (user.status !== 'Active') {
      return NextResponse.json(
        { success: false, message: 'Account is inactive or suspended' },
        { status: 403 }
      );
    }

    // Generate 6-digit OTP (e.g. static 123456 in dev or random 6 digits)
    const otpCode = '123456';
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save to UserOTP collection
    await UserOTP.create({
      userId: user._id,
      phone,
      otpCode,
      purpose: 'login',
      expiresAt,
      status: 'Pending',
    });

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${phone}. (Use test OTP: 123456)`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
