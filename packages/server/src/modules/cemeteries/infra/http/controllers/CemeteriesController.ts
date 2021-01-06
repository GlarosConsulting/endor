import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CreateCemeteryService from '@modules/cemeteries/services/CreateCemeteryService';
import ListAllCemeteriesService from '@modules/cemeteries/services/ListAllCemeteriesService';
import ListCemeteriesService from '@modules/cemeteries/services/ListCemeteriesService';
import CompaniesRepository from '@modules/companies/infra/typeorm/repositories/CompaniesRepository';
import EmployeesRepository from '@modules/employees/infra/typeorm/repositories/EmployeesRepository';

export default class CemeteriesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

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

    const createCemeteryService = container.resolve(CreateCemeteryService);

    const cemetery = await createCemeteryService.execute({ name, company_id });

    return response.json(cemetery);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const queryParams = request.query;
    let name;

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

    let cemeteries;

    if (!company.isFuneral) {
      const listAllCemeteries = container.resolve(ListAllCemeteriesService);

      if (!queryParams.name) {
        cemeteries = await listAllCemeteries.execute({});
      } else {
        name = String(queryParams.name);

        cemeteries = await listAllCemeteries.execute({ name });
      }
    } else {
      const listCemeteriesByCompany = container.resolve(ListCemeteriesService);

      if (!queryParams.name) {
        cemeteries = await listCemeteriesByCompany.execute({ company_id });
      } else {
        try {
          name = String(queryParams.name);

          cemeteries = await listCemeteriesByCompany.execute({
            company_id,
            name,
          });
        } catch (err) {
          throw new AppError(err);
        }
      }
    }

    return response.json(cemeteries);
  }
}
