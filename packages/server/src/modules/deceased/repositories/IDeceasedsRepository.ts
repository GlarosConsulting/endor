import ICreateDeceasedDTO from '../dtos/ICreateDeceasedDTO';
import Deceased from '../infra/typeorm/entities/Deceased';

export default interface IDeceasedRepository {
  findById(id: string): Promise<Deceased | undefined>;
  findByNameAndCompany(
    name: string,
    company_id: string,
  ): Promise<Deceased[] | undefined>;
  findAllByName(name: string): Promise<Deceased[] | undefined>;
  findAll(): Promise<Deceased[] | undefined>;
  findAllByCompany(company_id: string): Promise<Deceased[] | undefined>;
  create(data: ICreateDeceasedDTO): Promise<Deceased>;
  save(deceased: Deceased): Promise<Deceased>;
}
