import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { State } from 'src/state/entities/state.entity';

@Entity()
export class City extends AppBaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  code: string;

  @Column({ type: 'uuid' })
  stateId: string;

  @ManyToOne(() => State, (state) => state.cities)
  @JoinColumn({ name: 'stateId' })
  state: State;
}