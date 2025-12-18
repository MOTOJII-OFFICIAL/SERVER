import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfigController } from './email-config.controller';
import { EmailConfigService } from './email-config.service';
import { EmailConfig } from './entities/email-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailConfig])],
  controllers: [EmailConfigController],
  providers: [EmailConfigService],
  exports: [EmailConfigService],
})
export class EmailConfigModule {}
