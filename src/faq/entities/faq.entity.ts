import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';

@Entity()
export class FAQ extends AppBaseEntity {
  @Column()
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}