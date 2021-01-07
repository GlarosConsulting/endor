import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CompaniesRepository from '@modules/companies/infra/typeorm/repositories/CompaniesRepository';
import FindImageByNameService from '@modules/images/services/FindImageByNameService';

export default class ImagesController {
  public async show(request: Request, response: Response): Promise<Response> {
    const queryParams = request.query;

    const name = String(queryParams.name);

    if (!queryParams.company_id) {
      throw new AppError('Company id is required.');
    }

    const company_id = queryParams.company_id.toString();

    const companiesRepository = new CompaniesRepository();

    const showImage = container.resolve(FindImageByNameService);

    const companyByBodyId = await companiesRepository.findById(company_id);

    if (!companyByBodyId?.isFuneral) {
      throw new AppError('Company must be a funeral.');
    }

    const image = await showImage.execute({ name, company_id });

    return response.json(image);
  }
}
