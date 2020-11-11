import merge from 'lodash/merge';
import { v4 } from 'uuid';

import ICreateCustomerDTO from '../../dtos/ICreateCustomerDTO';
import Customer from '../../infra/typeorm/entities/Customer';
import ICustomersRepository from '../ICustomersRepository';

class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[] = [];

  public async findById(id: string): Promise<Customer | undefined> {
    const findCustomer = this.customers.find(customer => customer.id === id);

    return findCustomer;
  }

  public async findAll(): Promise<Customer[] | undefined> {
    const findAll = this.customers;

    return findAll;
  }

  public async findByName(name: string): Promise<Customer[] | undefined> {
    const findCustomer = this.customers.filter(
      customer => customer.name === name,
    );

    return findCustomer;
  }

  public async create(data: ICreateCustomerDTO): Promise<Customer> {
    const customer = new Customer();

    merge(customer, { id: v4() }, data);

    this.customers.push(customer);

    return customer;
  }

  public async save(customer: Customer): Promise<Customer> {
    const findIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === customer.id,
    );

    this.customers[findIndex] = customer;

    return customer;
  }
}

export default FakeCustomersRepository;
