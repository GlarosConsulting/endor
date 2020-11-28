import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Employee from '../infra/typeorm/entities/Employee';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IEmployeesRepository from '../repositories/IEmployeesRepository';

interface IRequest {
  name: string;
  role?: string;
  email: string;
  password: string;
}

@injectable()
class CreateEmployeesService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    role,
    email,
    password,
  }: IRequest): Promise<Employee> {
    const checkEmailExists = await this.employeesRepository.findByEmail(email);

    if (checkEmailExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    let data;

    if (!role) {
      data = {
        name,
        email,
        password: hashedPassword,
      };
    } else {
      data = {
        name,
        role,
        email,
        password: hashedPassword,
      };
    }

    const user = await this.employeesRepository.create(data);

    return user;
  }
}

export default CreateEmployeesService;
