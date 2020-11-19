import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import Cemetery from '../../../../cemeteries/infra/typeorm/entities/Cemetery';
import Deceased from '../../../../deceased/infra/typeorm/entities/Deceased';

@Entity('funerals')
export default class Funerals {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  url_cam: string;

  @Column()
  cemetery_id: string;

  @ManyToOne(() => Cemetery, cemetery => cemetery.funerals)
  @JoinColumn({ name: 'cemetery_id' })
  cemetery: Cemetery;

  @OneToMany(() => Deceased, deceased => deceased.id, { cascade: true })
  deceased: Deceased[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
