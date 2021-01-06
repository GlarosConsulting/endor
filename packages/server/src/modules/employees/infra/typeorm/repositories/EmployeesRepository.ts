import { getRepository, Like, Repository } from 'typeorm';

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
    const employee = await this.ormRepository.find({ where: {} });

    return employee;
  }

  public async findAllByCompany(
    company_id: string,
  ): Promise<Employee[] | undefined> {
    const employee = await this.ormRepository.find({ where: { company_id } });

    return employee;
  }

  public async findAllByName(name: string): Promise<Employee[] | undefined> {
    const employee = await this.ormRepository.find({
      where: { name: Like(`%${name}%`) },
    });

    return employee;
  }

  public async findByNameAndCompany(
    name: string,
    company_id: string,
  ): Promise<Employee[] | undefined> {
    const employee = await this.ormRepository.find({
      where: { name: Like(`%${name}%`), company_id },
    });

    return employee;
  }

  public async findEmployees(): Promise<Employee[] | undefined> {
    const employee = await this.ormRepository.find({
      where: {
        role: 'funcionario',
      },
    });

    return employee;
  }

  public async findEmployeesbyCompany(
    company_id: string,
  ): Promise<Employee[] | undefined> {
    const employee = await this.ormRepository.find({
      where: {
        role: 'funcionario',
        company_id,
      },
    });

    return employee;
  }

  public async findEmployeesByNameAndCompany(
    name: string,
    company_id: string,
  ): Promise<Employee[] | undefined> {
    const employee = await this.ormRepository.find({
      where: {
        name: Like(`%${name}%`),
        role: 'funcionario',
        company_id,
      },
    });

    return employee;
  }

  public async findEmployeesByName(
    name: string,
  ): Promise<Employee[] | undefined> {
    const employee = await this.ormRepository.find({
      where: {
        name: Like(`%${name}%`),
        role: 'funcionario',
      },
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
