import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { Country } from 'src/country/entities/country.entity';
import { City } from 'src/city/entities/city.entity';

@Entity()
export class State extends AppBaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  code: string;

  @Column({ type: 'uuid' })
  countryId: string;

  @ManyToOne(() => Country, (country) => country.states)
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @OneToMany(() => City, (city) => city.state)
  cities: City[];
}