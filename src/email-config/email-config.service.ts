import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailConfig } from './entities/email-config.entity';
import { UpdateEmailConfigDto } from './dto/update-email-config.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class EmailConfigService {
  constructor(
    @InjectRepository(EmailConfig)
    private emailConfigRepo: Repository<EmailConfig>,
  ) {}

  async getConfig(): Promise<EmailConfig> {
    let config = await this.emailConfigRepo.findOne({
      where: { status: DefaultStatus.ACTIVE },
    });

    if (!config) {
      config = this.emailConfigRepo.create({
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUsername: 'motojii.official@gmail.com',
        smtpPassword: 'lsdm fklu mjir qzng',
        fromName: 'MOTOJII',
        fromEmail: 'motojii.official@gmail.com',
        useSSL: false,
      });
      config = await this.emailConfigRepo.save(config);
    }

    return config;
  }

  async updateConfig(updateDto: UpdateEmailConfigDto): Promise<EmailConfig> {
    let config = await this.getConfig();
    Object.assign(config, updateDto);
    return this.emailConfigRepo.save(config);
  }
}
