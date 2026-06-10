import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService : UsersService,
        private jwtService : JwtService,
    ){}

    async register(dto : any){
        const existingUser = await this.usersService.findByEmail(dto.email)
        
        if(existingUser){
            throw new BadRequestException('email exist déjà')
        }

        const hashPassword = await bcrypt.hash(dto.password,10)

        const user = await this.usersService.create({
            ...dto,
            password : hashPassword
        })

        return({
            'message':'user created successfully',
            user
        })
    }

    async login(dto:any){
        const user = await this.usersService.findByEmail(dto.email)

        if(!user){
            throw new UnauthorizedException('invalid credentials')
        }
        const passwordMatch= await bcrypt.compare(dto.password,user.password)
        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };

        return {
        access_token:
            await this.jwtService.signAsync(payload),

        user
        };
    }

}
