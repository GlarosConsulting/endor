import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CreateDeceasedService from '@modules/deceased/services/CreateDeceasedService';
import CreateLiveLinkService from '@modules/deceased/services/CreateLiveLinkService';
import ListDeceasedService from '@modules/deceased/services/ListDeceasedService';
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

    const funeral = await funeralsRepository.findById(funeral_location_id);

    if (!funeral) {
      throw new AppError('Velório não encontrado.');
    }

    const { url_cam } = funeral;

    const live_chat_link = await createLiveLink.execute(url_cam);

    const deceased = await createDeceased.execute({
      name,
      responsible_id,
      funeral_initial_date,
      funeral_final_date,
      sepulting_date,
      funeral_location_id,
      sepulting_location_id,
      live_chat_link,
    });

    return response.json(classToClass(deceased));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const queryParams = request.query;
    let name;

    const listDeceaseds = container.resolve(ListDeceasedService);

    let deceaseds;

    if (!queryParams.name) {
      deceaseds = await listDeceaseds.execute({});
    } else {
      try {
        name = String(queryParams.name);

        deceaseds = await listDeceaseds.execute({ name });
      } catch (err) {
        throw new AppError(err);
      }
    }

    return response.json(deceaseds);
  }
}
