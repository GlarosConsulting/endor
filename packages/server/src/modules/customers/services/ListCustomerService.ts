import { injectable, inject } from 'tsyringe';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name?: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name }: IRequest): Promise<Customer[] | undefined> {
    let customers;

    if (!name) {
      customers = await this.customersRepository.findAll();
    } else {
      customers = await this.customersRepository.findByName(name);
    }

    return customers;
  }
}

export default CreateCustomerService;
