import { injectable, inject } from 'tsyringe';

import Employee from '../infra/typeorm/entities/Employee';
import IEmployeesRepository from '../repositories/IEmployeesRepository';

interface IRequest {
  name?: string;
}

@injectable()
class ListEmployeesService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
  ) {}

  public async execute({ name }: IRequest): Promise<Employee[] | undefined> {
    let employees;

    if (!name) {
      employees = await this.employeesRepository.findAll();
    } else {
      employees = await this.employeesRepository.findByName(name);
    }

    return employees;
  }
}

export default ListEmployeesService;
