import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

import Funeral from '../../../../funerals/infra/typeorm/entities/Funeral';

@Entity('cemeteries')
export default class Cemeteries {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Funeral, funeral => funeral.cemetery, { cascade: true })
  funerals: Funeral[];

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
