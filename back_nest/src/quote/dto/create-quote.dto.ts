import { CreateQuoteItemDto } from './create-quote-item.dto';

export class CreateQuoteDto {
  userId: string;

  clientId: string;

  quoteNumber: number;

  title?: string;

  description?: string;

  condition_payement?: string;

  billingAddress?: string;

  discount?: string;

  total: number;

  issueDate: Date;

  expiryDate?: Date;

  notes?: string;

  items: CreateQuoteItemDto[];
}