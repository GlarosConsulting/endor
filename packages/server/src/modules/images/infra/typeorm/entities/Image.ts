import { Expose } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Company from '@modules/companies/infra/typeorm/entities/Company';

@Entity('images')
export default class Funerals {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  file: string;

  @Expose({ name: 'img_url' })
  getImageUrl(): string | null {
    if (!this.name) return null;

    return `${process.env.APP_API_URL}/files/${this.name}`;
  }

  @Column()
  company_id: string;

  @ManyToOne(() => Company, company => company.cemeteries)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
