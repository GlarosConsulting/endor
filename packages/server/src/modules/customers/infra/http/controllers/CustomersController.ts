import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import ListCustomerService from '@modules/customers/services/ListCustomerService';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, telephone, gender, cpf, birth_date } = request.body;
    const createCustomer = container.resolve(CreateCustomerService);

    const customer = await createCustomer.execute({
      name,
      email,
      telephone,
      gender,
      cpf,
      birth_date,
    });

    console.log(customer);
    return response.json(classToClass(customer));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const queryParams = request.query;
    let name;

    const listCustomer = container.resolve(ListCustomerService);

    let customers;

    if (!queryParams.name) {
      customers = await listCustomer.execute({});
    } else {
      try {
        name = String(queryParams.name);

        customers = await listCustomer.execute({ name });
      } catch (err) {
        throw new AppError(err);
      }
    }

    return response.json(customers);
  }
}
