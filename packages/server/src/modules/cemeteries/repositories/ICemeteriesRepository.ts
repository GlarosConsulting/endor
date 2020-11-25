import ICreateCemeteryDTO from '../dtos/ICreateCemeteryDTO';
import Cemetery from '../infra/typeorm/entities/Cemetery';

export default interface ICemeterysRepository {
  findAll(): Promise<Cemetery[] | undefined>;
  findByName(name: string): Promise<Cemetery[] | undefined>;
  findById(id: string): Promise<Cemetery | undefined>;
  create(data: ICreateCemeteryDTO): Promise<Cemetery>;
  save(cemetery: Cemetery): Promise<Cemetery>;
}
