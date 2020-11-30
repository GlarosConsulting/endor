import ICreateEmployeeDTO from '../dtos/ICreateEmployeeDTO';
import Employee from '../infra/typeorm/entities/Employee';

export default interface IEmployeesRepository {
  findAll(): Promise<Employee[] | undefined>;
  findByName(name: string): Promise<Employee[] | undefined>;
  findEmployees(): Promise<Employee[] | undefined>;
  findEmployeesByName(name: string): Promise<Employee[] | undefined>;
  findById(id: string): Promise<Employee | undefined>;
  findByEmail(email: string): Promise<Employee | undefined>;
  create(data: ICreateEmployeeDTO): Promise<Employee>;
  save(employee: Employee): Promise<Employee>;
}
