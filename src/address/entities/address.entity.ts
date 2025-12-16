import { Column, Entity, ManyToOne } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { Account } from 'src/account/entities/account.entity';
import { Country } from 'src/country/entities/country.entity';
import { State } from 'src/state/entities/state.entity';
import { City } from 'src/city/entities/city.entity';
import { AddressType } from 'src/enum';

@Entity()
export class Address extends AppBaseEntity {
  @Column({ type: 'varchar', length: 100 })
  streetName: string;

  @Column({ type: 'varchar', length: 50 })
  houseNo: string;

  @Column({ type: 'varchar', length: 10 })
  pinCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  landmark: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ type: 'uuid' })
  countryId: string;

  @Column({ type: 'uuid' })
  stateId: string;

  @Column({ type: 'uuid' })
  cityId: string;

  @Column({ type: 'enum', enum: AddressType, default: AddressType.HOME })
  addressType: AddressType;

  @ManyToOne(() => Account, (account) => account.addresses)
  account: Account;

  @ManyToOne(() => Country)
  country: Country;

  @ManyToOne(() => State)
  state: State;

  @ManyToOne(() => City)
  city: City;
}