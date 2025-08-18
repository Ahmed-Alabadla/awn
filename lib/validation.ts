import { z } from 'zod';

export const userRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  phone: z.string().optional(),
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
  phone: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  location: z.string().min(1, 'Please select a location'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
export type OrganizationRegisterValues = z.infer<typeof organizationRegisterSchema>;


export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;