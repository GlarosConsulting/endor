import { injectable, inject } from 'tsyringe';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name?: string;
  company_id: string;
}

@injectable()
class ListCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    name,
    company_id,
  }: IRequest): Promise<Customer[] | undefined> {
    let customers;

    if (!name) {
      customers = await this.customersRepository.findAllByCompany(company_id);
    } else {
      customers = await this.customersRepository.findByNameAndCompany(
        name,
        company_id,
      );
    }

    return customers;
  }
}

export default ListCustomerService;
