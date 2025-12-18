import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';

@Entity()
export class News extends AppBaseEntity {
  @Column()
  heading: string;

  @Column({ nullable: true })
  subHeading: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  photoPath: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;
}