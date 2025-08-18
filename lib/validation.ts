import { z } from 'zod';
export const optionalStringSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""));

// Phone regex: must start with + and country code, e.g. +1, +44, etc.
const phoneWithCountryRegex = /^\+\d{1,3}[\s\d-]{4,}$/;

export const phoneWithCountrySchema = optionalStringSchema.refine(
  (val) => {
    if (!val || val === "") return true; // optional
    return phoneWithCountryRegex.test(val);
  },
  {
    message: "Phone number must include country code (e.g. +1...)",
  }
);

export const userRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  phone: phoneWithCountrySchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
export type UserRegisterValues = z.infer<typeof userRegisterSchema>;


export const organizationRegisterSchema = z.object({
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  phone: phoneWithCountrySchema,
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  description: optionalStringSchema,
  location: optionalStringSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
export type OrganizationRegisterValues = z.infer<typeof organizationRegisterSchema>;
