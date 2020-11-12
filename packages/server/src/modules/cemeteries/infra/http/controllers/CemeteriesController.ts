import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCemeteryService from '@modules/cemeteries/services/CreateCemeteryService';
import ListAllCemeteriesService from '@modules/cemeteries/services/ListAllCemeteriesService';

export default class CemeteriesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createCemeteryService = container.resolve(CreateCemeteryService);

    const cemetery = await createCemeteryService.execute({ name });

    return response.json(cemetery);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const listAllCemeteries = container.resolve(ListAllCemeteriesService);

    const cemeteries = await listAllCemeteries.execute();

    return response.json(cemeteries);
  }
}
