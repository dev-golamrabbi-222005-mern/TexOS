import { z } from 'zod';

export const requestOtpSchema = z.object({
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number is too long' })
    .trim(),
});

export const loginSchema = z.object({
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number is too long' })
    .trim(),
  otpCode: z
    .string()
    .length(6, { message: 'OTP must be exactly 6 digits' })
    .trim(),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
