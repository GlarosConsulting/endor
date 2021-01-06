import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CompaniesRepository from '@modules/companies/infra/typeorm/repositories/CompaniesRepository';
import CreateEmployeeService from '@modules/employees/services/CreateEmployeeService';
import ListAllEmployeesService from '@modules/employees/services/ListAllEmployeesService';
import ListEmployeesService from '@modules/employees/services/ListEmployeesService';

import EmployeesRepository from '../../typeorm/repositories/EmployeesRepository';

export default class EmpoloyeesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, role, email, password } = request.body;

    const employeesRepository = new EmployeesRepository();
    const companiesRepository = new CompaniesRepository();

    const { user } = request;

    let company_id;

    if (user) {
      const userData = await employeesRepository.findById(user.id);

      if (!userData) {
        throw new AppError('User not found.');
      }

      company_id = userData.company_id;
    } else {
      company_id = request.body.company_id;
    }

    if (!company_id) {
      throw new AppError('Company must be a funeral.');
    }

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

    const createEmployee = container.resolve(CreateEmployeeService);

    const employee = await createEmployee.execute({
      name,
      role,
      email,
      password,
      company_id,
    });

    return response.json(classToClass(employee));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const queryParams = request.query;

    let name;

    const listEmployees = container.resolve(ListEmployeesService);

    let employees;

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
      const listAllEmployees = container.resolve(ListAllEmployeesService);

      if (!queryParams.name) {
        employees = await listAllEmployees.execute({ userId: id });
      } else {
        name = String(queryParams.name);

        employees = await listAllEmployees.execute({ userId: id, name });
      }
    } else if (!queryParams.name) {
      employees = await listEmployees.execute({ userId: id, company_id });
    } else {
      try {
        name = String(queryParams.name);

        employees = await listEmployees.execute({
          userId: id,
          name,
          company_id,
        });
      } catch (err) {
        throw new AppError(err);
      }
    }
    return response.json(employees);
  }
}
