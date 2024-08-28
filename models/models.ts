export type Course = {
  id?: number;
  title?: string;
  description?: string;
  format?: string;
  duration?: string;
  created_on?: string;
  course_type: string;
  product_line: string;
  slug?: string;
  audience: string;
}

export type CustomField = {
  field_id: number;
  value: string;
  title: string;
  type: string;
}