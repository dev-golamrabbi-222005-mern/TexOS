import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '../db/connect';
import User from '../db/models/User';
import UserOTP from '../db/models/UserOTP';
import { loginSchema } from '../validations/auth';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'PhoneOTP',
      credentials: {
        phone: { label: 'Phone Number', type: 'text', placeholder: '+8801700000001' },
        otpCode: { label: 'OTP Code', type: 'text', placeholder: '123456' },
      },
      async authorize(credentials) {
        // 1. Validate inputs with Zod
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error(parsed.error.issues[0]?.message || 'Invalid input details');
        }

        const { phone, otpCode } = parsed.data;

        await connectDB();

        // 2. Find User by phone
        const user = await User.findOne({ phone });
        if (!user) {
          throw new Error('User not found with this phone number');
        }

        if (user.status !== 'Active') {
          throw new Error('Your account is inactive or suspended');
        }

        // 3. Verify OTP: allow test OTP '123456' or check UserOTP collection
        if (otpCode !== '123456') {
          const otpRecord = await UserOTP.findOne({
            phone,
            otpCode,
            status: 'Pending',
            expiresAt: { $gt: new Date() },
          });

          if (!otpRecord) {
            throw new Error('Invalid or expired OTP code');
          }

          // Mark OTP as verified
          otpRecord.status = 'Verified';
          otpRecord.verifiedAt = new Date();
          await otpRecord.save();
        }

        // 4. Update user last login
        user.lastLogin = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          fullName: user.fullName,
          phone: user.phone,
          userType: user.userType,
          factoryId: user.factoryId ? user.factoryId.toString() : undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.fullName = user.fullName;
        token.phone = user.phone;
        token.userType = user.userType;
        token.factoryId = user.factoryId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.fullName = token.fullName;
        session.user.phone = token.phone;
        session.user.userType = token.userType;
        session.user.factoryId = token.factoryId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
