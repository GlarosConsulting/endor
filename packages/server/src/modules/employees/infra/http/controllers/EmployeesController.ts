import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CreateEmployeeService from '@modules/employees/services/CreateEmployeeService';
import ListEmployeesService from '@modules/employees/services/ListEmployeesService';

export default class EmpoloyeesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createEmployee = container.resolve(CreateEmployeeService);

    const employee = await createEmployee.execute({
      name,
      email,
      password,
    });

    return response.json(classToClass(employee));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const queryParams = request.query;
    let name;

    const listEmployees = container.resolve(ListEmployeesService);

    let employees;

    if (!queryParams.name) {
      employees = await listEmployees.execute({});
    } else {
      try {
        name = String(queryParams.name);

        employees = await listEmployees.execute({ name });
      } catch (err) {
        throw new AppError(err);
      }
    }

    return response.json(employees);
  }
}
