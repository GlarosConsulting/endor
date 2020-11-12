import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Employee from '../infra/typeorm/entities/Employee';
import IEmployeesRepository from '../repositories/IEmployeesRepository';

interface IRequest {
  employee_id: string;
}

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
  ) {}

  public async execute({ employee_id }: IRequest): Promise<Employee> {
    const employee = await this.employeesRepository.findById(employee_id);

    if (!employee) {
      throw new AppError('User not found.');
    }

    return employee;
  }
}
