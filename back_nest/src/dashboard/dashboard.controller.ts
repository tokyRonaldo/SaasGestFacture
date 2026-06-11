import { Body,Post,Controller,Get, Param, Query, Delete, Put, Patch } from "@nestjs/common";
import { DashboardService } from "./dashboard.service"

@Controller('dashboard')
export class DashboardController{
    constructor( private readonly dashboardService : DashboardService){}

    @Get(':userId')
    async getDashboard(
        @Param('userId') userId : string,
        @Query('period') period: string,
    ){
        console.log('atoooo');
        return this.dashboardService.getDashboard(userId, period);
    }
}