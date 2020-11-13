import ICreateFuneralDTO from '../dtos/ICreateFuneralDTO';
import Funeral from '../infra/typeorm/entities/Funeral';

export default interface IFuneralsRepository {
  findById(id: string): Promise<Funeral | undefined>;
  findByCemeteryId(id: string): Promise<Funeral[] | undefined>;
  findAll(): Promise<Funeral[] | undefined>;
  create(data: ICreateFuneralDTO): Promise<Funeral>;
  save(funeral: Funeral): Promise<Funeral>;
}
