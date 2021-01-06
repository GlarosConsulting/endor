import { getRepository, Like, Repository } from 'typeorm';

import ICreateCustomerDTO from '@modules/customers/dtos/ICreateCustomerDTO';
import ICustomerRepository from '@modules/customers/repositories/ICustomersRepository';

import Customer from '../entities/Customer';

class CustomerRepository implements ICustomerRepository {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = getRepository(Customer);
  }

  public async findById(
    company_id: string,
    id: string,
  ): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOne(id, {
      where: { company_id },
    });

    return customer;
  }

  public async findAllByCompany(
    company_id: string,
  ): Promise<Customer[] | undefined> {
    const customers = await this.ormRepository.find({
      where: { company_id },
    });

    return customers;
  }

  public async findAll(): Promise<Customer[] | undefined> {
    const customers = await this.ormRepository.find({});

    return customers;
  }

  public async findAllByName(name: string): Promise<Customer[] | undefined> {
    const customer = await this.ormRepository.find({
      where: { name: Like(`%${name}%`) },
    });

    return customer;
  }

  public async findByNameAndCompany(
    name: string,
    company_id: string,
  ): Promise<Customer[] | undefined> {
    const customer = await this.ormRepository.find({
      where: { name: Like(`%${name}%`), company_id },
    });

    return customer;
  }

  public async findByEmail(
    company_id: string,
    email: string,
  ): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOne({
      where: { email, company_id },
    });

    return customer;
  }

  public async create(data: ICreateCustomerDTO): Promise<Customer> {
    const customer = this.ormRepository.create(data);

    await this.ormRepository.save(customer);

    return customer;
  }

  public async save(customer: Customer): Promise<Customer> {
    return this.ormRepository.save(customer);
  }
}

export default CustomerRepository;
