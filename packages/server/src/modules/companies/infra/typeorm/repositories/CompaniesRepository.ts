import { getRepository, Like, Repository } from 'typeorm';

import ICreateCompanyDTO from '@modules/companies/dtos/ICreateCompaniesDTO';
import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';

import Company from '../entities/Company';

class CompaniesRepository implements ICompaniesRepository {
  private ormRepository: Repository<Company>;

  constructor() {
    this.ormRepository = getRepository(Company);
  }

  public async findAll(): Promise<Company[] | undefined> {
    const companies = await this.ormRepository.find();

    return companies;
  }

  public async findAllCustomersCompanies(): Promise<Company[] | undefined> {
    const companies = await this.ormRepository.find({
      where: { isFuneral: true },
    });

    return companies;
  }

  public async findByName(name: string): Promise<Company[] | undefined> {
    const companies = await this.ormRepository.find({
      where: { name: Like(`%${name}%`) },
    });

    return companies;
  }

  public async findById(id: string): Promise<Company | undefined> {
    const company = await this.ormRepository.findOne(id);

    return company;
  }

  public async create(data: ICreateCompanyDTO): Promise<Company> {
    const company = this.ormRepository.create(data);

    await this.ormRepository.save(company);

    return company;
  }

  public async save(company: Company): Promise<Company> {
    return this.ormRepository.save(company);
  }
}

export default CompaniesRepository;
