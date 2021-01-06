import { injectable, inject } from 'tsyringe';

import Company from '../infra/typeorm/entities/Company';
import ICompaniesRepository from '../repositories/ICompaniesRepository';

@injectable()
class ListAllCemeteryService {
  constructor(
    @inject('CompaniesRepository')
    private companyRepository: ICompaniesRepository,
  ) {}

  public async execute(company_id: string): Promise<Company | undefined> {
    const company = await this.companyRepository.findById(company_id);

    return company;
  }
}

export default ListAllCemeteryService;
