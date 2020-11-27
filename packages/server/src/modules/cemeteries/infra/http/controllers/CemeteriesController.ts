import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CreateCemeteryService from '@modules/cemeteries/services/CreateCemeteryService';
import ListCemeteriesService from '@modules/cemeteries/services/ListCemeteriesService';

export default class CemeteriesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createCemeteryService = container.resolve(CreateCemeteryService);

    const cemetery = await createCemeteryService.execute({ name });

    return response.json(cemetery);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const queryParams = request.query;
    let name;

    const listCemeteries = container.resolve(ListCemeteriesService);

    let cemeteries;

    if (!queryParams.name) {
      cemeteries = await listCemeteries.execute({});
    } else {
      try {
        name = String(queryParams.name);

        cemeteries = await listCemeteries.execute({ name });
      } catch (err) {
        throw new AppError(err);
      }
    }

    return response.json(cemeteries);
  }
}
