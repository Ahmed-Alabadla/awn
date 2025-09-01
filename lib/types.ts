export interface Announcement {
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
}