import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCompanyService from '@modules/companies/services/CreateCompanyService';
import ListCompaniesService from '@modules/companies/services/ListCompaniesService';
import EmployeesRepository from '@modules/employees/infra/typeorm/repositories/EmployeesRepository';

export default class CemeteriesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createCompanyService = container.resolve(CreateCompanyService);

    const cemetery = await createCompanyService.execute({ name });

    return response.json(cemetery);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const listCompanies = container.resolve(ListCompaniesService);

    const employeesRepository = new EmployeesRepository();

    const { user } = request;

    const userData = await employeesRepository.findById(user.id);

    const companies = await listCompanies.execute(userData);

    return response.json(companies);
  }
}
