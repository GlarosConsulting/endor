import {
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import Customer from '../../../../customers/infra/typeorm/entities/Customer';
import Funeral from '../../../../funerals/infra/typeorm/entities/Funeral';

@Entity('deceased')
export default class Cemeteries {
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
  funeral_id: string;

  @ManyToOne(() => Funeral, funeral => funeral.deceased)
  @JoinColumn({ name: 'funeral_id' })
  funeral: Funeral;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
