// src/lib/types.ts
export type TemplateResponse = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTemplateRequest = {
  name: string;
  description?: string | null;
};