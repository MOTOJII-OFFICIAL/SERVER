import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { EmailConfigService } from './email-config.service';
import { UpdateEmailConfigDto } from './dto/update-email-config.dto';

@Controller('email-config')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class EmailConfigController {
  constructor(private readonly emailConfigService: EmailConfigService) {}

  @Get()
  getConfig() {
    return this.emailConfigService.getConfig();
  }

  @Patch()
  updateConfig(@Body() updateDto: UpdateEmailConfigDto) {
    return this.emailConfigService.updateConfig(updateDto);
  }
}
