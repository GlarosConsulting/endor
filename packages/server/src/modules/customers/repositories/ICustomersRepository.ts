import ICreateCustomerDTO from '../dtos/ICreateCustomerDTO';
import Customer from '../infra/typeorm/entities/Customer';

export default interface ICustomersRepository {
  findById(id: string, company_id: string): Promise<Customer | undefined>;
  findAllByCompany(company_id: string): Promise<Customer[] | undefined>;
  findAll(): Promise<Customer[] | undefined>;
  findAllByName(name: string): Promise<Customer[] | undefined>;
  findByNameAndCompany(
    name: string,
    company_id: string,
  ): Promise<Customer[] | undefined>;
  findByEmail(email: string, company_id: string): Promise<Customer | undefined>;
  create(data: ICreateCustomerDTO): Promise<Customer>;
  save(customer: Customer, company_id: string): Promise<Customer>;
}
