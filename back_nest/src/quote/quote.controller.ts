import { Body,Post,Controller,Get, Param, Query, Delete, Put, Patch } from "@nestjs/common";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";
import { CreateQuoteItemDto } from "./dto/create-quote-item.dto";
import { QuoteService } from "./quote.service";
import { QuoteStatus } from "@prisma/client";

@Controller('quote')
export class QuoteController{
    constructor( private readonly quoteService : QuoteService){}

    @Post()
    async create(@Body() dto: CreateQuoteDto) {
        const resp = await this.quoteService.create(dto);
        return resp;
    }

    @Put(':quoteId')
    async update(
        @Param('quoteId') quoteId : string,
        @Body() dto:UpdateQuoteDto) {
        const resp = await this.quoteService.updateQuote(quoteId,dto);
        return resp;
    }

    @Get(':userId')
    async getQuotes(
        @Param('userId') userId : string,
        @Query('page') page : string,
        @Query('limit') limit : string,
        @Query('status') status?: string,
        @Query('search') search?: string,
    ){
        console.log('atoooo');
        return this.quoteService.getQuotes(
            userId,
            Number(page),
            Number(limit),
            status,
            search
        );
    }

    @Delete(':quoteId')
    async deleteQuote(@Param('quoteId') quoteId : string){
        return this.quoteService.deleteQuote(quoteId)
    }

    @Get('quote/:quoteId')
    async getQuoteById(@Param('quoteId') quoteId: string) {
        return this.quoteService.getQuoteById(quoteId);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: QuoteStatus,
    ) {
        return this.quoteService.updateStatus(
            id,
            status,
        );
    }

    @Get('create/invoice/:id')
    createInvoice(
        @Param('id') id : string
    ){
        return this.quoteService.createInvoice(id)
    }

    
}