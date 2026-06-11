import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ClientModule } from './client/client.module';
import { QuoteModule } from './quote/quote.module';
import { InvoiceModule } from './invoice/invoice.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule,ClientModule,QuoteModule,InvoiceModule,DashboardModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
