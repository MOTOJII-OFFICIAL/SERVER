import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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
import { UserAdditionalDetailsModule } from './user-additional-details/user-additional-details.module';
import { EmailConfigModule } from './email-config/email-config.module';
import { EmailModule } from './email/email.module';
import { NotificationModule } from './notification/notification.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { ServiceModule } from './service/service.module';
import { ServiceCategoryModule } from './service-category/service-category.module';
dotenv.config();

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute
      },
    ]),
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
    AddressModule,
    UserAdditionalDetailsModule,
    EmailConfigModule,
    EmailModule,
    NotificationModule,
    VehicleModule,
    ServiceModule,
    ServiceCategoryModule

  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
