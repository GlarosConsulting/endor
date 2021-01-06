import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ListCompanyByIdService from '@modules/companies/services/ListCompanyByIdService';

export default class CemeteriesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { company_id } = request.params;

    const listCompanyByIdService = container.resolve(ListCompanyByIdService);

    if (!company_id) {
      throw new AppError('Company Id is required.');
    }

    const company = await listCompanyByIdService.execute(company_id.toString());

    if (!company) {
      throw new AppError('Company not found.');
    }

    return response.json(company);
  }
}
