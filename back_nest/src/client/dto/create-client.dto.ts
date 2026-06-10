export class CreateClientDto{
    name: string;
    company?: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
    userId: string;
}