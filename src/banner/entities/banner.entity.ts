import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';

@Entity()
export class Banner extends AppBaseEntity {
  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ type: 'text', nullable: true })
  imagePath: string;
}
