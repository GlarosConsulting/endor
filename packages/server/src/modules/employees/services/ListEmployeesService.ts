import { injectable, inject } from 'tsyringe';

import Employee from '../infra/typeorm/entities/Employee';
import IEmployeesRepository from '../repositories/IEmployeesRepository';

interface IRequest {
  userId: string;
  name?: string;
  company_id: string;
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
    company_id,
  }: IRequest): Promise<Employee[] | undefined> {
    const user = await this.employeesRepository.findById(userId);

    let employees;

    if (user?.role === 'administrador' || user?.role === 'master') {
      if (!name) {
        employees = await this.employeesRepository.findAllByCompany(company_id);
      } else {
        employees = await this.employeesRepository.findByNameAndCompany(
          name,
          company_id,
        );
      }
    } else if (!name) {
      employees = await this.employeesRepository.findEmployeesbyCompany(
        company_id,
      );
    } else {
      employees = await this.employeesRepository.findEmployeesByNameAndCompany(
        name,
        company_id,
      );
    }

    return employees;
  }
}

export default ListEmployeesService;
