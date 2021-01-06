import { injectable, inject } from 'tsyringe';

import Company from '../infra/typeorm/entities/Company';
import ICompaniesRepository from '../repositories/ICompaniesRepository';

interface IRequest {
  name: string;
}

@injectable()
class CreateCompanyService {
  constructor(
    @inject('CompaniesRepository')
    private companyRepository: ICompaniesRepository,
  ) {}

  public async execute({ name }: IRequest): Promise<Company> {
    const company = await this.companyRepository.create({
      name,
      isFuneral: true,
    });

    return company;
  }
}

export default CreateCompanyService;
