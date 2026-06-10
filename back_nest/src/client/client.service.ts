import { Injectable } from "@nestjs/common";
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ClientService{
    constructor(
        private prisma : PrismaService
    ){}
    create(data:any){
         console.log("DATA RECEIVED:", data);
        return this.prisma.client.create({
        data
        });
    }

    deleteClient(id:string){
        return this.prisma.client.delete({
        where : {
            id
        }
    })
    }

    async getClients(userId: string,page : number,limit : number) {
        const skip = (page - 1) * limit;
        
        const clients = await this.prisma.client.findMany({
            where: {
            userId: userId,
            },
                skip,
            take: limit,
            orderBy: {
            id: 'desc',
            },
        });

        const total = await this.prisma.client.count({
            where: {
            userId: userId,
            },
        })


        return {
            data: clients,
            total,
            page,
            lastPage: Math.ceil(total / limit),
            from: (page - 1) * limit + 1,
            to: Math.min(page * limit, total),
        };
    }

    async getAllClients(userId: string) {

        return this.prisma.client.findMany({
            where: {
            userId: userId,
            },
            orderBy: {
            createdAt: 'desc',
            },
        });

    }

    async editClient(clientId: string, dto:any) {
        return this.prisma.client.update({
            where: {
            id: clientId,
            },
            data: {
            name: dto.name,
            company: dto.company,
            email: dto.email,
            phone: dto.phone,
            address: dto.address,
            notes: dto.notes,
            },
        });
    }

}