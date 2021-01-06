import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CompaniesRepository from '@modules/companies/infra/typeorm/repositories/CompaniesRepository';
import EmployeesRepository from '@modules/employees/infra/typeorm/repositories/EmployeesRepository';
import CreateImagesService from '@modules/images/services/CreateImageService';

export default class ImagesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;
    const file = request.file.filename;

    const createImage = container.resolve(CreateImagesService);

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
    const image = await createImage.execute({
      name,
      file,
      company_id,
    });

    return response.json(image);
  }
}
