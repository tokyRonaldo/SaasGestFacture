import { Injectable } from "@nestjs/common";
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService{
    constructor(
        private prisma : PrismaService
    ){}

    async getDashboard(userId: string, period: string) {

        const now = new Date();

        let startDate = new Date();

        switch (period) {
        case "6_months":
            startDate.setMonth(now.getMonth() - 6);
            break;

        case "this_year":
            startDate = new Date(now.getFullYear(), 0, 1);
            break;

        default:
            startDate.setMonth(now.getMonth() - 6);
        }

        const invoices = await this.prisma.invoice.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startDate,
                },
            },
        });

        const quotes = await this.prisma.quote.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startDate,
                },
            },
        });

        const clients = await this.prisma.client.count({
            where: { userId },
        });

        const totalRevenue = invoices
            .filter(i => i.status === 'PAID')
            .reduce((sum, i) => sum + i.total, 0);

        const sentQuotes = quotes.filter(
        q => q.status === 'SENT'
        );

        const pendingQuotesCount = sentQuotes.length;

        const pendingQuotesTotal = sentQuotes.reduce(
        (sum, q) => sum + q.total,
        0
        );

        const recentInvoices = await this.prisma.invoice.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startDate,
                },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { client: true }
        });


        const monthlyRevenue = Array.from({ length: 12 }, (_, index) => ({
        month: index,
        total: 0,
        }));

        const paidInvoices = await this.prisma.invoice.findMany({
            where: {
                userId,
                status: 'PAID',
                createdAt: {
                    gte: startDate,
                },
            },
        });

        paidInvoices.forEach((invoice) => {
        const month = new Date(invoice.createdAt).getMonth();
        monthlyRevenue[month].total += invoice.total;
        });

        const revenueChart = monthlyRevenue.map((item) => ({
        name: [
            'Jan',
            'Fév',
            'Mar',
            'Avr',
            'Mai',
            'Juin',
            'Juil',
            'Aoû',
            'Sep',
            'Oct',
            'Nov',
            'Déc',
        ][item.month],
        total: item.total,
        }));

        return {
            totalRevenue,
            clients,
            invoices,
            quotes,
            pendingQuotesTotal,
            recentInvoices,
            pendingQuotesCount,
            revenueChart
        };
        }
}