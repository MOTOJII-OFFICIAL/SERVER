import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailConfigModule } from 'src/email-config/email-config.module';

@Module({
  imports: [EmailConfigModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
