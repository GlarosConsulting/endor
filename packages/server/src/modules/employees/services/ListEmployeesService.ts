import { injectable, inject } from 'tsyringe';

import Employee from '../infra/typeorm/entities/Employee';
import IEmployeesRepository from '../repositories/IEmployeesRepository';

interface IRequest {
  userId: string;
  name?: string;
}

@injectable()
class ListEmployeesService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
  ) {}

  public async execute({
    name,
    userId,
  }: IRequest): Promise<Employee[] | undefined> {
    const user = await this.employeesRepository.findById(userId);

    let employees;

    if (user?.role === 'administrador') {
      if (!name) {
        employees = await this.employeesRepository.findAll();
      } else {
        employees = await this.employeesRepository.findByName(name);
      }
    } else if (!name) {
      employees = await this.employeesRepository.findEmployees();
    } else {
      employees = await this.employeesRepository.findEmployeesByName(name);
    }

    return employees;
  }
}

export default ListEmployeesService;
