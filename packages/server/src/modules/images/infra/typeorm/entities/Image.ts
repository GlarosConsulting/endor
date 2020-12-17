import { Expose } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('images')
export default class Funerals {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  name: string;

  @Column()
  file: string;

  @Expose({ name: 'img_url' })
  getImageUrl(): string | null {
    if (!this.name) return null;

    return `${process.env.APP_API_URL}/files/${this.name}`;
  }
}
