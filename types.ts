
export enum TicketStatus {
  Open = 'Open',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
}

export enum TicketPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Urgent = 'Urgent',
}

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  requester: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
  summary?: string;
}

export type View = 'dashboard' | 'all-tickets' | 'new-ticket';

export interface GeminiSuggestion {
  summary: string;
  priority: TicketPriority;
}
