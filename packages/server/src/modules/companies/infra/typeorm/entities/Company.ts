import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

import Cemetery from '../../../../cemeteries/infra/typeorm/entities/Cemetery';
import Customer from '../../../../customers/infra/typeorm/entities/Customer';
import Deceased from '../../../../deceased/infra/typeorm/entities/Deceased';
import Employee from '../../../../employees/infra/typeorm/entities/Employee';
import Funeral from '../../../../funerals/infra/typeorm/entities/Funeral';
import Image from '../../../../images/infra/typeorm/entities/Image';

@Entity('companies')
export default class Companies {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  isFuneral: boolean;

  @OneToMany(() => Cemetery, cemetery => cemetery.id, { cascade: true })
  cemeteries: Cemetery[];

  @OneToMany(() => Customer, customer => customer.id, { cascade: true })
  customers: Customer[];

  @OneToMany(() => Deceased, deceased => deceased.id, { cascade: true })
  deceased: Deceased[];

  @OneToMany(() => Employee, employee => employee.id, { cascade: true })
  employees: Employee[];

  @OneToMany(() => Funeral, funeral => funeral.id, { cascade: true })
  funerals: Funeral[];

  @OneToMany(() => Image, image => image.id, { cascade: true })
  images: Image[];

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
