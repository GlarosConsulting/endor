import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import Company from '../../../../companies/infra/typeorm/entities/Company';
import Deceased from '../../../../deceased/infra/typeorm/entities/Deceased';
import Funeral from '../../../../funerals/infra/typeorm/entities/Funeral';

@Entity('cemeteries')
export default class Cemeteries {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  company_id: string;

  @ManyToOne(() => Company, company => company.cemeteries)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Funeral, funeral => funeral.cemetery, { cascade: true })
  funerals: Funeral[];

  @OneToMany(() => Deceased, deceased => deceased.sepulting_location, {
    cascade: true,
  })
  deceased_buried: Deceased[];

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
