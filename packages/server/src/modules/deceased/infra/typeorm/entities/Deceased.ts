import {
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import Cemetery from '../../../../cemeteries/infra/typeorm/entities/Cemetery';
import Company from '../../../../companies/infra/typeorm/entities/Company';
import Customer from '../../../../customers/infra/typeorm/entities/Customer';
import Funeral from '../../../../funerals/infra/typeorm/entities/Funeral';

@Entity('deceased')
export default class Deceased {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  responsible_id: string;

  @ManyToOne(() => Customer, customer => customer.deceased)
  @JoinColumn({ name: 'responsible_id' })
  responsible: Customer;

  @Column()
  funeral_initial_date: Date;

  @Column()
  funeral_final_date: Date;

  @Column()
  sepulting_date: Date;

  @Column()
  live_chat_link: string;

  @Column()
  funeral_location_id: string;

  @ManyToOne(() => Funeral, funeral => funeral.deceased)
  @JoinColumn({ name: 'funeral_location_id' })
  funeral_location: Funeral;

  @Column()
  sepulting_location_id: string;

  @ManyToOne(() => Cemetery, cemetery => cemetery.deceased_buried)
  @JoinColumn({ name: 'sepulting_location_id' })
  sepulting_location: Cemetery;

  @Column()
  company_id: string;

  @ManyToOne(() => Company, company => company.cemeteries)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
