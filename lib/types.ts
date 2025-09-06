export interface Announcement {
  organization: any;
  category: string;
  id: number;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  url: string;
  category_name: string;
  organization_name: string;
  creator_name: string;
  status: string;
  admin_notes: string;
  created_at: Date;
  updated_at: Date;
  image: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  profile_image?: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface Organization {
  id: number;
  organization_name: string;
  profile_image: string | null;
  description: string;
  website?: string;
  location?: string;
  verified: boolean;
  is_active: boolean;
  email?: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ApiError {
  response?: {
    status?: number;
    statusText?: string;
    data?: {
      detail?: string;
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  message?: string;
}
