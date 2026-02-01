export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactPayload {
  name: string;
  email: string;
  phone?: string;
  description: string;
}
