import { Request, Response } from 'express';
import { container } from 'tsyringe';

import FindImageByNameService from '@modules/images/services/FindImageByNameService';

export default class ImagesController {
  public async show(request: Request, response: Response): Promise<Response> {
    const queryParams = request.query;
    const name = String(queryParams.name);

    const showImage = container.resolve(FindImageByNameService);

    const image = await showImage.execute({ name });

    return response.json(image);
  }
}
