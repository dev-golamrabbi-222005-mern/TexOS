import { DefaultSession } from 'next-auth';
import { UserType } from '@/lib/db/models/User';

declare module 'next-auth' {
  interface User {
    id: string;
    fullName: string;
    phone: string;
    userType: UserType;
    factoryId?: string;
  }

  interface Session {
    user: {
      id: string;
      fullName: string;
      phone: string;
      userType: UserType;
      factoryId?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    fullName: string;
    phone: string;
    userType: UserType;
    factoryId?: string;
  }
}
