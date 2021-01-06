import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CompaniesRepository from '@modules/companies/infra/typeorm/repositories/CompaniesRepository';
import CreateDeceasedService from '@modules/deceased/services/CreateDeceasedService';
import CreateLiveLinkService from '@modules/deceased/services/CreateLiveLinkService';
import ListAllDeceasedService from '@modules/deceased/services/ListAllDeceasedService';
import ListDeceasedService from '@modules/deceased/services/ListDeceasedService';
import EmployeesRepository from '@modules/employees/infra/typeorm/repositories/EmployeesRepository';
import FuneralsRepository from '@modules/funerals/infra/typeorm/repositories/FuneralsRepository';

export default class DeceasedController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      responsible_id,
      funeral_initial_date,
      funeral_final_date,
      sepulting_date,
      funeral_location_id,
      sepulting_location_id,
    } = request.body;

    const createLiveLink = container.resolve(CreateLiveLinkService);
    const createDeceased = container.resolve(CreateDeceasedService);

    const funeralsRepository = new FuneralsRepository();
    const employeesRepository = new EmployeesRepository();
    const companiesRepository = new CompaniesRepository();

    const funeral = await funeralsRepository.findById(funeral_location_id);

    if (!funeral) {
      throw new AppError('Velório não encontrado.');
    }

    const { url_cam } = funeral;

    const live_chat_link = await createLiveLink.execute(url_cam);

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

    const deceased = await createDeceased.execute({
      name,
      responsible_id,
      funeral_initial_date,
      funeral_final_date,
      sepulting_date,
      funeral_location_id,
      sepulting_location_id,
      live_chat_link,
      company_id,
    });

    return response.json(classToClass(deceased));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const queryParams = request.query;
    let name;

    const listDeceaseds = container.resolve(ListDeceasedService);

    let deceaseds;

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
      const listAllDeceased = container.resolve(ListAllDeceasedService);

      if (!queryParams.name) {
        deceaseds = await listAllDeceased.execute({});
      } else {
        name = String(queryParams.name);

        deceaseds = await listAllDeceased.execute({ name });
      }
    } else if (!queryParams.name) {
      deceaseds = await listDeceaseds.execute({ company_id });
    } else {
      try {
        name = String(queryParams.name);

        deceaseds = await listDeceaseds.execute({ name, company_id });
      } catch (err) {
        throw new AppError(err);
      }
    }
    return response.json(deceaseds);
  }
}
