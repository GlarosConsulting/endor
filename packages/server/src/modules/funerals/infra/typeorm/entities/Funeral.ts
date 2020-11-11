import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import Cemetery from '../../../../cemeteries/infra/typeorm/entities/Cemetery';
import Deceased from '../../../../deceased/infra/typeorm/entities/Deceased';

@Entity('funerals')
export default class Cemeteries {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cemetery_id: string;

  @OneToMany(() => Cemetery, cemetery => cemetery.funerals)
  @JoinColumn({ name: 'cemetery.id' })
  cemetery: Cemetery;

  @OneToMany(() => Deceased, deceased => deceased.id, { cascade: true })
  deceased: Deceased[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
