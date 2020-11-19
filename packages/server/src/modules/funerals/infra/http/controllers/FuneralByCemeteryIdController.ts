import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import FindByCemeteryId from '@modules/funerals/services/FindByCemeteryId';

export default class FuneralByCemeteryIdController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { cemetery_id } = request.params;

    if (!cemetery_id) {
      throw new AppError('Cemetery id is required.');
    }

    const findByCemeteryId = container.resolve(FindByCemeteryId);

    const fuenral = await findByCemeteryId.execute(String(cemetery_id));

    return response.json(classToClass(fuenral));
  }
}
