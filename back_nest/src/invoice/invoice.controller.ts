import { Body,Post,Controller,Get, Param, Query, Delete, Put, Patch } from "@nestjs/common";
import { InvoiceService } from "./invoice.service"
import { InvoiceStatus } from "@prisma/client";

@Controller('invoice')
export class InvoiceController{
    constructor( private readonly invoiceService : InvoiceService){}

    @Get(':userId')
    async getInvoices(
        @Param('userId') userId : string,
        @Query('page') page : string,
        @Query('limit') limit : string,
        @Query('status') status?: string,
        @Query('search') search?: string,
    ){
        console.log('atoooo');
        return this.invoiceService.getInvoices(
            userId,
            Number(page),
            Number(limit),
            status,
            search
        );
    }

    @Delete(':invoiceId')
    async deleteQuote(@Param('invoiceId') invoiceId : string){
        return this.invoiceService.deleteInvoice(invoiceId)
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: InvoiceStatus,
    ) {
        return this.invoiceService.updateStatus(
            id,
            status,
        );
    }


}