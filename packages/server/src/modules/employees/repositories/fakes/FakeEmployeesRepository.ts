import merge from 'lodash/merge';
import { v4 } from 'uuid';

import ICreateEmployeeDTO from '../../dtos/ICreateEmployeeDTO';
import Employee from '../../infra/typeorm/entities/Employee';
import IEmplyeesRepository from '../IEmployeesRepository';

class FakeEmployeesRepository implements IEmplyeesRepository {
  private employees: Employee[] = [];

  public async findAll(): Promise<Employee[] | undefined> {
    const findEmployees = this.employees;

    return findEmployees;
  }

  public async findByName(name: string): Promise<Employee[] | undefined> {
    const findEmployees = this.employees.filter(
      employee => employee.name === name,
    );

    return findEmployees;
  }

  public async create(data: ICreateEmployeeDTO): Promise<Employee> {
    const employee = new Employee();

    merge(employee, { id: v4() }, data);

    this.employees.push(employee);

    return employee;
  }

  public async save(employee: Employee): Promise<Employee> {
    const findIndex = this.employees.findIndex(
      findEmployee => findEmployee.id === employee.id,
    );

    this.employees[findIndex] = employee;

    return employee;
  }
}

export default FakeEmployeesRepository;
