import { z } from "zod";
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

// User registration schema
export const userRegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirm: z.string().min(8, "Please confirm your password"),
    phone: phoneWithCountrySchema,
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords don't match",
    path: ["password_confirm"],
  });
export type UserRegisterValues = z.infer<typeof userRegisterSchema>;

// Organization registration schema
export const organizationRegisterSchema = z
  .object({
    name: z.string().min(2, "Organization name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .refine((val) => /^\+\d{1,3}[\s\d-]{4,}$/.test(val), {
        message: "Phone number must include country code (e.g. +1...)",
      }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirm: z.string().min(8, "Please confirm your password"),
    description: z.string().min(1, "Description is required").trim(),
    website: z
      .string()
      .url("Please enter a valid URL")
      .min(1, "Website is required"),
    location: z.string().min(1, "Location is required").trim(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords don't match",
    path: ["password_confirm"],
  });
export type OrganizationRegisterValues = z.infer<
  typeof organizationRegisterSchema
>;

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginValues = z.infer<typeof loginSchema>;

// Forgot Password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

// Reset Password schema
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirm: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords don't match",
    path: ["password_confirm"],
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

// Profile schema
export const profileSchema = z.object({
  name: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must be at most 100 characters")
    .optional(),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true; // Allow empty values
        return /^\+\d{6,20}$/.test(val);
      },
      {
        message:
          "Phone must be a valid international number with country code (e.g., +970597762451)",
      }
    ),

  profile_image: z
    .union([
      z.string().url("Please provide a valid image URL"), // For existing profile image URLs
      z.instanceof(File, { message: "Please upload a valid image file" }), // For file uploads
      z.null(), // For no image
      z.undefined(), // For optional field
    ])
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Optional field
        if (typeof val === "string") return true; // URL string
        if (val instanceof File) {
          // Validate file type for uploads
          const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
          ];
          return allowedTypes.includes(val.type);
        }
        return false;
      },
      {
        message:
          "Profile image must be a valid URL or image file (JPEG, PNG, WebP)",
      }
    ),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;

// Change Password Form
export const changePasswordSchema = z
  .object({
    old_password: z.string().min(8, "Password must be at least 8 characters"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must include uppercase, lowercase, number, and special character (@$!%*?&)"
      ),
    new_password_confirm: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirm, {
    message: "Passwords do not match",
    path: ["new_password_confirm"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

// Report Form schema
export const reportSchema = z
  .object({
    type: z.enum(["system", "organization", "other"]),
    target_org: z.string().optional(),
    title: z
      .string()
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title must be at most 100 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must be at most 1000 characters"),
  })
  .refine(
    (data) => {
      if (data.type === "organization") {
        return data.target_org && data.target_org.trim() !== "";
      }
      return true;
    },
    {
      message: "Please select an organization to report",
      path: ["target_org"],
    }
  );
export type ReportFormValues = z.infer<typeof reportSchema>;
