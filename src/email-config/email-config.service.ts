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

    return config;
  }

  async updateConfig(updateDto: UpdateEmailConfigDto): Promise<EmailConfig> {
    let config = await this.getConfig();
    Object.assign(config, updateDto);
    return this.emailConfigRepo.save(config);
  }
}
