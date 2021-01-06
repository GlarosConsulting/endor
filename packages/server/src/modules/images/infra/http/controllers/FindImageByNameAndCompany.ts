import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CompaniesRepository from '@modules/companies/infra/typeorm/repositories/CompaniesRepository';
import EmployeesRepository from '@modules/employees/infra/typeorm/repositories/EmployeesRepository';
import FindImageByNameService from '@modules/images/services/FindImageByNameService';

export default class ImagesController {
  public async show(request: Request, response: Response): Promise<Response> {
    const queryParams = request.query;

    const name = String(queryParams.name);

    const employeesRepository = new EmployeesRepository();
    const companiesRepository = new CompaniesRepository();

    const showImage = container.resolve(FindImageByNameService);

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
      if (!queryParams.company_id) {
        throw new AppError('Company not found.');
      }

      company_id = queryParams.company_id.toString();
    }

    const companyByBodyId = await companiesRepository.findById(company_id);

    if (!companyByBodyId?.isFuneral) {
      throw new AppError('Company must be a funeral.');
    }

    const image = await showImage.execute({ name, company_id });

    return response.json(image);
  }
}
