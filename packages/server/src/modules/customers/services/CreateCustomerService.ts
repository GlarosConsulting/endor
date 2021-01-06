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
  company_id: string;
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
    company_id,
  }: IRequest): Promise<Customer> {
    const checkEmailExists = await this.customersRepository.findByEmail(
      company_id,
      email,
    );

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
      company_id,
    });

    return customer;
  }
}

export default CreateCustomerService;
