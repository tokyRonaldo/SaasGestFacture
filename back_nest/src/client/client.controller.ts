import { Body,Post,Controller,Get, Param, Query, Delete, Put } from "@nestjs/common";
import { ClientService } from "./client.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Controller('client')
export class ClientController{
    constructor(private readonly clientService : ClientService){}
    @Post()
    create(@Body() dto:CreateClientDto){
        return this.clientService.create(dto)
    }


    @Get(':userId')
    getClient(
        @Param('userId') userId : string,
        @Query('page') page : string,
        @Query('limit') limit : string
    ){
        return this.clientService.getClients(userId,Number(page),Number(limit))
    }

      // ALL CLIENTS
    @Get('all/:userId')
    getAllClients(
        @Param('userId') userId: string
    ) {
        return this.clientService.getAllClients(userId);
    }

    @Delete(':userId')
    deleteClient(@Param('userId') userId : string){
        return this.clientService.deleteClient(userId)
    }

    @Put(':clientId')
    editClient(
            @Param('clientId') clientId : string,
        @Body() dto:UpdateClientDto

    ){
        return this.clientService.editClient(clientId,dto)
    }

}