import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Account } from 'src/account/entities/account.entity';
import { UserPermission } from 'src/user-permissions/entities/user-permission.entity';

import { Session } from './entities/session.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { CaslAbilityFactory } from './factory/casl-ability.factory';


@Module({
  imports: [
    TypeOrmModule.forFeature([Account, UserPermission, Session]),
    PassportModule,
    CacheModule.register(),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.MJ_JWT_SECRET || 'default-secret',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CaslAbilityFactory],
  exports: [AuthService, CaslAbilityFactory],
})
export class AuthModule {}
