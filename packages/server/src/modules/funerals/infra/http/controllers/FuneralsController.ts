import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateFuneralService from '@modules/funerals/services/CreateFuneralService';
import ListAllFuneralsService from '@modules/funerals/services/ListAllFuneralsService';

export default class FuneralsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, url_cam, cemetery_id } = request.body;

    const createFuneral = container.resolve(CreateFuneralService);

    const funeral = await createFuneral.execute({
      name,
      url_cam,
      cemetery_id,
    });

    return response.json(funeral);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const listFUnerals = container.resolve(ListAllFuneralsService);

    const fuenrals = await listFUnerals.execute();

    return response.json(classToClass(fuenrals));
  }
}
