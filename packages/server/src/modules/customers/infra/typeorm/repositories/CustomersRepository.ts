import { getRepository, Repository } from 'typeorm';

import ICreateCustomerDTO from '@modules/customers/dtos/ICreateCustomerDTO';
import ICustomerRepository from '@modules/customers/repositories/ICustomersRepository';

import Customer from '../entities/Customer';

class CustomerRepository implements ICustomerRepository {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = getRepository(Customer);
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOne(id);

    return customer;
  }

  public async findAll(): Promise<Customer[] | undefined> {
    const customers = await this.ormRepository.find();

    return customers;
  }

  public async findByName(name: string): Promise<Customer[] | undefined> {
    const customer = await this.ormRepository.find({
      where: { name },
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
