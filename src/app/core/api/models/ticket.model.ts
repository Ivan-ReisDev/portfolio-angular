export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'closed';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  links: string[] | null;
  userId: string;
  user: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  priority?: TicketPriority;
  links?: string[];
}

export interface UpdateTicketPayload {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
  links?: string[];
}
