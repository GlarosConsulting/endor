import { getRepository, Repository } from 'typeorm';

import ICreateEmployeeDTO from '@modules/employees/dtos/ICreateEmployeeDTO';
import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';

import Employee from '../entities/Employee';

class EmnployeesRepository implements IEmployeesRepository {
  private ormRepository: Repository<Employee>;

  constructor() {
    this.ormRepository = getRepository(Employee);
  }

  public async findById(id: string): Promise<Employee | undefined> {
    const employee = await this.ormRepository.findOne({ where: { id } });

    return employee;
  }

  public async findAll(): Promise<Employee[] | undefined> {
    const employee = await this.ormRepository.find();

    return employee;
  }

  public async findByName(name: string): Promise<Employee[] | undefined> {
    const employee = await this.ormRepository.find({
      where: { name },
    });

    return employee;
  }

  public async findByEmail(email: string): Promise<Employee | undefined> {
    const employee = await this.ormRepository.findOne({
      where: { email },
    });

    return employee;
  }

  public async create(data: ICreateEmployeeDTO): Promise<Employee> {
    const employee = this.ormRepository.create(data);

    await this.ormRepository.save(employee);

    return employee;
  }

  public async save(employee: Employee): Promise<Employee> {
    return this.ormRepository.save(employee);
  }
}

export default EmnployeesRepository;
