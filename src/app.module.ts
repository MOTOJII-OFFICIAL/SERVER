import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { BannerModule } from './banner/banner.module';
import { AuthModule } from './auth/auth.module';
import { MenusModule } from './menus/menus.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UserPermissionsModule } from './user-permissions/user-permissions.module';
import { CityModule } from './city/city.module';
import { StateModule } from './state/state.module';
import { CountryModule } from './country/country.module';
import { AddressModule } from './address/address.module';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.MJ_POSTGRES_HOST,
      port: Number(process.env.MJ_POSTGRES_PORT),
      username: process.env.MJ_POSTGRES_USER,
      password: process.env.MJ_POSTGRES_PASSWORD,
      database: process.env.MJ_POSTGRES_DB,
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),

    AccountModule,
    BannerModule,
    AuthModule,
    MenusModule,
    PermissionsModule,
    UserPermissionsModule,
    CityModule,
    StateModule,
    CountryModule,
    AddressModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
