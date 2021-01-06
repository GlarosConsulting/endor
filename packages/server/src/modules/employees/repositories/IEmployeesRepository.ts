import ICreateEmployeeDTO from '../dtos/ICreateEmployeeDTO';
import Employee from '../infra/typeorm/entities/Employee';

export default interface IEmployeesRepository {
  findById(id: string): Promise<Employee | undefined>;
  findAll(): Promise<Employee[] | undefined>;
  findAllByCompany(company_id: string): Promise<Employee[] | undefined>;
  findAllByName(name: string): Promise<Employee[] | undefined>;
  findByNameAndCompany(
    name: string,
    company_id: string,
  ): Promise<Employee[] | undefined>;
  findEmployees(): Promise<Employee[] | undefined>;
  findEmployeesbyCompany(company_id: string): Promise<Employee[] | undefined>;
  findEmployeesByNameAndCompany(
    name: string,
    company_id: string,
  ): Promise<Employee[] | undefined>;
  findEmployeesByName(name: string): Promise<Employee[] | undefined>;
  findByEmail(email: string): Promise<Employee | undefined>;
  create(data: ICreateEmployeeDTO): Promise<Employee>;
  save(employee: Employee): Promise<Employee>;
}
