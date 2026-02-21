import * as z from "zod";

export const RegisterSchema = z.object({
    firstName: z.string({ message: "First name is required" }).min(1).trim(),
    lastName: z.string({ message: "Last name is required" }).min(1).trim(),
    email: z.email({ message: "Invalid email address" }).toLowerCase().trim(),
    password: z.string().min(6).trim(),
    role: z.enum(["customer", "admin", "manager"]).optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
