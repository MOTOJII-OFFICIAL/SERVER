import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { DefaultStatus } from 'src/enum';

@Entity('email_configs')
export class EmailConfig extends AppBaseEntity {
  @Column({ default: 'smtp.gmail.com' })
  smtpHost: string;

  @Column({ default: 587 })
  smtpPort: number;

  @Column()
  smtpUsername: string;

  @Column()
  smtpPassword: string;

  @Column({ default: 'MotoJii' })
  fromName: string;

  @Column()
  fromEmail: string;

  @Column({ default: false })
  useSSL: boolean;
}
