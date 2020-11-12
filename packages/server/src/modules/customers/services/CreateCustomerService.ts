import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
  telephone: string;
  gender: string;
  cpf: string;
  birth_date: Date;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    name,
    email,
    telephone,
    gender,
    cpf,
    birth_date,
  }: IRequest): Promise<Customer> {
    const checkEmailExists = await this.customersRepository.findByEmail(email);
    console.log(checkEmailExists);

    if (checkEmailExists) {
      throw new AppError('Email address already used.');
    }

    const customer = await this.customersRepository.create({
      name,
      email,
      telephone,
      gender,
      cpf,
      birth_date,
    });

    return customer;
  }
}

export default CreateCustomerService;
