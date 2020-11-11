import ICreateDeceasedDTO from '../dtos/ICreateDeceasedDTO';
import Deceased from '../infra/typeorm/entities/Deceased';

export default interface IDeceasedRepository {
  findByName(name: string): Promise<Deceased[] | undefined>;
  findAll(): Promise<Deceased[] | undefined>;
  create(data: ICreateDeceasedDTO): Promise<Deceased>;
  save(deceased: Deceased): Promise<Deceased>;
}
