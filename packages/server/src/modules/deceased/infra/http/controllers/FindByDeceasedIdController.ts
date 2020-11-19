import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import FindByDeceasedIdService from '@modules/deceased/services/FindByDeceasedIdService';

export default class DeceasedController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      new AppError('Id is required.');
    }

    const listDeceaseds = container.resolve(FindByDeceasedIdService);

    const deceased = await listDeceaseds.execute({ id });

    return response.json(deceased);
  }
}
