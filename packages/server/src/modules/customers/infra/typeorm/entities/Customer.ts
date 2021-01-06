import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Deceased from '../../../../cemeteries/infra/typeorm/entities/Cemetery';
import Company from '../../../../companies/infra/typeorm/entities/Company';

@Entity('customers')
export default class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  telephone: string;

  @Column()
  gender: string;

  @OneToMany(() => Deceased, deceased => deceased.id, { cascade: true })
  deceased: Deceased[];

  @Column({ length: 11 })
  cpf: string;

  @Column()
  birth_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  company_id: string;

  @ManyToOne(() => Company, company => company.cemeteries)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
