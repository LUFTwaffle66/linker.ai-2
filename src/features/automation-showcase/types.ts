export interface AutomationCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string | null;
}

export interface AutomationExample {
  id: number;
  category_id: number;
  title: string;
  short_summary: string;
  full_description: string;
  image_url?: string | null;
  related_skills?: string[] | null;
  category?: AutomationCategory | null;
}
