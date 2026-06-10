import { Injectable } from "@nestjs/common";
import { PrismaService } from 'src/prisma/prisma.service';
import { InvoiceStatus } from "@prisma/client";

@Injectable()
export class InvoiceService{
    constructor(
        private prisma : PrismaService
    ){}



    async getInvoices(
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
                    invoiceNumber: {
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

        const invoices = await this.prisma.invoice.findMany({
            where,
            include: {
                items: true,
                client: true,
                //invoice : true

            },
            skip,
            take: limit,
            orderBy: {
                id: 'desc',
            },
        });

        const total = await this.prisma.invoice.count({
            where,
        });

        return {
            data: invoices,
            total,
            page,
            lastPage: Math.ceil(total / limit),
            from: total === 0 ? 0 : skip + 1,
            to: Math.min(skip + limit, total),
        };
    }

    async deleteInvoice(id:string){
        return this.prisma.invoice.delete({
            where : {
                id
            }
        })
    }

    async updateStatus(
        id: string,
        status: InvoiceStatus,
    ) {
        return this.prisma.invoice.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });
    }



}
