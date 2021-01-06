import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CompaniesRepository from '@modules/companies/infra/typeorm/repositories/CompaniesRepository';
import EmployeesRepository from '@modules/employees/infra/typeorm/repositories/EmployeesRepository';
import CreateFuneralService from '@modules/funerals/services/CreateFuneralService';
import ListAllFuneralsService from '@modules/funerals/services/ListAllFuneralsService';
import ListFuneralsByCompanyService from '@modules/funerals/services/ListFuneralsByCompanyService';
import UpdateFuneralService from '@modules/funerals/services/UpdateFuneralService';

export default class FuneralsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, url_cam, cemetery_id } = request.body;

    const createFuneral = container.resolve(CreateFuneralService);

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

    const funeral = await createFuneral.execute({
      name,
      url_cam,
      cemetery_id,
      company_id,
    });

    return response.json(funeral);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id, name, url_cam } = request.body;

    const updateFuneral = container.resolve(UpdateFuneralService);

    const funeral = await updateFuneral.execute({
      id,
      name,
      url_cam,
    });

    return response.json(funeral);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { company_id } = request.query;

    const { user } = request;

    const employeesRepository = new EmployeesRepository();
    const companiesRepository = new CompaniesRepository();

    const userData = await employeesRepository.findById(user.id);

    if (!userData) {
      throw new AppError('User not found.');
    }

    let companyId;

    if (!company_id) {
      companyId = userData.company_id;
    } else {
      companyId = company_id.toString();
    }

    const company = await companiesRepository.findById(companyId);

    if (!company) {
      throw new AppError('Company not found.');
    }

    let funerals;

    if (!company.isFuneral) {
      const listAllOfUnerals = container.resolve(ListAllFuneralsService);

      funerals = await listAllOfUnerals.execute();
    } else {
      const listFuneralsByCompany = container.resolve(
        ListFuneralsByCompanyService,
      );

      funerals = await listFuneralsByCompany.execute(companyId);
    }

    return response.json(classToClass(funerals));
  }
}
