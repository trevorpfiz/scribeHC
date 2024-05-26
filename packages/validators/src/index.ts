import { z } from "zod";

// auth
export const SignInSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
export type SignIn = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});
export type SignUp = z.infer<typeof SignUpSchema>;

export const OTPSchema = z.object({
  otp: z.string().min(6, {
    message: "OTP must be at least 6 characters",
  }),
});
export type OTP = z.infer<typeof OTPSchema>;
