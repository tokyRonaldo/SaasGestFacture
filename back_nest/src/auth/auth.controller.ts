import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor (
        private AuthService : AuthService
    ){}

    @Post('register')
    register(
        @Body() dto:RegisterDto
    ) {
        return this.AuthService.register(dto)
    }

    @Post('login')
    login(
        @Body() dto:LoginDto
    ){
        return this.AuthService.login(dto)
    }
}
