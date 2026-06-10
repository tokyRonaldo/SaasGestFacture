import { Injectable } from "@nestjs/common";
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";
import { QuoteStatus } from "@prisma/client";


@Injectable()
export class QuoteService{
    constructor(
        private prisma : PrismaService
    ){}

    async create(dto: CreateQuoteDto) {

        const { items,userId, clientId, ...quoteData } = dto;

        const lastQuote = await this.prisma.quote.findFirst({
        orderBy: { quoteNumber: 'desc' },
        });


        const nextNumber = (lastQuote?.quoteNumber ?? 0) + 1;

        const quote = await this.prisma.quote.create({

            data: {

                ...quoteData,


                total: Number(quoteData.total),

                issueDate: new Date(quoteData.issueDate),

                quoteNumber : nextNumber,

                expiryDate: quoteData.expiryDate
                    ? new Date(quoteData.expiryDate)
                    : null,

                user: {
                    connect: {
                        id: userId
                    }
                },

                client: {
                    connect: {
                        id: clientId
                    }
                }
            }
        });

        // 2. insérer les items
        if (items && items.length > 0) {

            console.log('-------items----------')
            console.log(items)
            await this.prisma.quoteItem.createMany({
                data: items.map(item => ({
                    ...item,
                    quoteId: quote.id, // lien important
                }))
            });
        }


        // 3. retourner le quote avec items
        return this.prisma.quote.findUnique({
            where: { id: quote.id },
            include: {
                items: true
            }
        });
    }

    createQuoteItem(data:any){
         console.log("DATA RECEIVED:", data);
        return this.prisma.quoteItem.create({
        data
        });
    }


    async getAllQuotes(userId: string) {

        return this.prisma.quote.findMany({
            where: {
            userId: userId,
            },
            include: {
                items: true,
                client:true
            },
            orderBy: {
            createdAt: 'desc',
            },
        });

    }


    async getQuotes(
        userId: string,
        page: number,
        limit: number,
        status?: string,
        search?: string,
    ) {
        const skip = (page - 1) * limit;

        const where: any = {
            userId,
        };

        // filtre status
        if (status) {
            where.status = status;
        }

        // recherche
        if (search) {
            where.OR = [
                {
                    quoteNumber: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    client: {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                },
            ];
        }

        const quotes = await this.prisma.quote.findMany({
            where,
            include: {
                items: true,
                client: true,
                invoice : true

            },
            skip,
            take: limit,
            orderBy: {
                id: 'desc',
            },
        });

        const total = await this.prisma.quote.count({
            where,
        });

        return {
            data: quotes,
            total,
            page,
            lastPage: Math.ceil(total / limit),
            from: total === 0 ? 0 : skip + 1,
            to: Math.min(skip + limit, total),
        };
    }

    async updateQuote(id: string, dto: UpdateQuoteDto) {

        const { items, clientId, ...quoteData } = dto;

        // 1. update quote principal
        const updatedQuote = await this.prisma.quote.update({
            where: { id },
            data: {

                ...quoteData,

                total: quoteData.total !== undefined
                    ? Number(quoteData.total)
                    : undefined,

                issueDate: quoteData.issueDate
                    ? new Date(quoteData.issueDate)
                    : undefined,

                expiryDate: quoteData.expiryDate
                    ? new Date(quoteData.expiryDate)
                    : undefined,

                client: clientId
                    ? {
                        connect: { id: clientId }
                    }
                    : undefined,
            }
        });

        // 2. UPDATE ITEMS (stratégie simple : delete + recreate)
        if (items) {

            // supprimer anciens items
            await this.prisma.quoteItem.deleteMany({
                where: { quoteId: id }
            });

            // recréer nouveaux items
            if (items.length > 0) {
                await this.prisma.quoteItem.createMany({
                    data: items.map(item => ({
                        ...item,
                        quoteId: id
                    }))
                });
            }
        }

        // 3. retourner quote complet
        return this.prisma.quote.findUnique({
            where: { id },
            include: {
                items: true,
                client: true
            }
        });
    }

    async deleteQuote(id:string){
        return this.prisma.quote.delete({
            where : {
                id
            }
        })
    }

    async getQuoteById(id: string) {
        return this.prisma.quote.findUnique({
            where: { id },
            include: {
                items: true,
                client: true,
                user: true
            }
        });
    }

    async updateStatus(
        id: string,
        status: QuoteStatus,
    ) {
        return this.prisma.quote.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });
    }



    async createInvoice(id: string) {
        const quote = await this.prisma.quote.findUnique({
            where: { id },
            include: {
                items: true,
                client: true,
                user: true,
                invoice: true,
            },
        });

        if (!quote) {
            throw new Error('Quote not found');
        }

        // Empêcher la création d'une seconde facture
        if (quote.invoice) {
            throw new Error('This quote already has an invoice');
        }

        const invoiceNumber = `INV-${Date.now()}`;

        const invoice = await this.prisma.invoice.create({
            data: {
                invoiceNumber,

                title: quote.title,
                description: quote.description,
                condition_payement: quote.condition_payement,
                billingAddress: quote.billingAddress,

                total: quote.total,
                discount: Number(quote.discount ?? 0),

                dueDate: quote.expiryDate ?? new Date(),

                notes: quote.notes,

                user: {
                    connect: {
                        id: quote.userId,
                    },
                },

                client: {
                    connect: {
                        id: quote.clientId,
                    },
                },

                quote: {
                    connect: {
                        id: quote.id,
                    },
                },

                items: {
                    create: quote.items.map((item) => ({
                        label: item.label,
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        total: item.total,
                    })),
                },
            },

            include: {
                items: true,
                client: true,
                quote: true,
            },
        });

        return invoice;
    }

}