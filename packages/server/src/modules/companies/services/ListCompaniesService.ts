import { injectable, inject } from 'tsyringe';

import Employee from '@modules/employees/infra/typeorm/entities/Employee';

import Company from '../infra/typeorm/entities/Company';
import ICompaniesRepository from '../repositories/ICompaniesRepository';

@injectable()
class ListAllCemeteryService {
  constructor(
    @inject('CompaniesRepository')
    private companyRepository: ICompaniesRepository,
  ) {}

  public async execute(
    user: Employee | undefined,
  ): Promise<Company[] | undefined> {
    let companies;

    if (user?.role === 'master') {
      companies = await this.companyRepository.findAll();
    } else {
      companies = await this.companyRepository.findAllCustomersCompanies();
    }

    return companies;
  }
}

export default ListAllCemeteryService;
