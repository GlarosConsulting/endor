import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CompaniesRepository from '@modules/companies/infra/typeorm/repositories/CompaniesRepository';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import ListAllCustomerService from '@modules/customers/services/ListAllCustomerService';
import ListCustomerService from '@modules/customers/services/ListCustomerService';
import EmployeesRepository from '@modules/employees/infra/typeorm/repositories/EmployeesRepository';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, telephone, gender, cpf, birth_date } = request.body;

    const employeesRepository = new EmployeesRepository();
    const companiesRepository = new CompaniesRepository();

    const { user } = request;

    const userData = await employeesRepository.findById(user.id);

    if (!userData) {
      throw new AppError('User not found.');
    }

    let { company_id } = userData;

    const company = await companiesRepository.findById(company_id);

    if (!company) {
      throw new AppError('Company not found.');
    }

    if (!company.isFuneral) {
      company_id = request.body.company_id;
    }

    const companyByBodyId = await companiesRepository.findById(company_id);

    if (!companyByBodyId?.isFuneral) {
      throw new AppError('Company must be a funeral.');
    }

    const createCustomer = container.resolve(CreateCustomerService);

    const customer = await createCustomer.execute({
      name,
      email,
      telephone,
      gender,
      cpf,
      birth_date,
      company_id,
    });

    return response.json(classToClass(customer));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const queryParams = request.query;

    let name;

    let customers;

    const employeesRepository = new EmployeesRepository();
    const companiesRepository = new CompaniesRepository();

    const { user } = request;

    const userData = await employeesRepository.findById(user.id);

    if (!userData) {
      throw new AppError('User not found.');
    }

    let company_id;

    if (!queryParams.company_id) {
      company_id = userData.company_id;
    } else {
      company_id = queryParams.company_id.toString();
    }

    const company = await companiesRepository.findById(company_id);

    if (!company) {
      throw new AppError('Company not found.');
    }

    if (!company.isFuneral) {
      const listAllCustomers = container.resolve(ListAllCustomerService);

      if (!queryParams.name) {
        customers = await listAllCustomers.execute({});
      } else {
        name = String(queryParams.name);

        customers = await listAllCustomers.execute({ name });
      }
    } else {
      const listCustomer = container.resolve(ListCustomerService);

      if (!queryParams.name) {
        customers = await listCustomer.execute({ company_id });
      } else {
        try {
          name = String(queryParams.name);

          customers = await listCustomer.execute({ name, company_id });
        } catch (err) {
          throw new AppError(err);
        }
      }
    }

    return response.json(customers);
  }
}
