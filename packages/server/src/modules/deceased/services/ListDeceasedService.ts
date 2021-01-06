import { injectable, inject } from 'tsyringe';

import Deceased from '../infra/typeorm/entities/Deceased';
import IDeceasedsRepository from '../repositories/IDeceasedsRepository';

interface IRequest {
  name?: string;
  company_id: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('DeceasedRepository')
    private deceasedsRepository: IDeceasedsRepository,
  ) {}

  public async execute({
    name,
    company_id,
  }: IRequest): Promise<Deceased[] | undefined> {
    let deceaseds;

    if (!name) {
      deceaseds = await this.deceasedsRepository.findAllByCompany(company_id);
    } else {
      deceaseds = await this.deceasedsRepository.findByNameAndCompany(
        name,
        company_id,
      );
    }

    return deceaseds;
  }
}

export default CreateCustomerService;
