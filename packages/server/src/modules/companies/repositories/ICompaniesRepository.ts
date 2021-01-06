import ICreateCompanyDTO from '../dtos/ICreateCompaniesDTO';
import Company from '../infra/typeorm/entities/Company';

export default interface ICompanysRepository {
  findAll(): Promise<Company[] | undefined>;
  findAllCustomersCompanies(): Promise<Company[] | undefined>;
  findByName(name: string): Promise<Company[] | undefined>;
  findById(id: string): Promise<Company | undefined>;
  create(data: ICreateCompanyDTO): Promise<Company>;
  save(company: Company): Promise<Company>;
}
