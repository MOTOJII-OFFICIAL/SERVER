import { Column, Entity, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { State } from 'src/state/entities/state.entity';

@Entity()
export class Country extends AppBaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  code: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  flagUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  flagPath: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  phoneCode: string;

  @OneToMany(() => State, (state) => state.country)
  states: State[];
}