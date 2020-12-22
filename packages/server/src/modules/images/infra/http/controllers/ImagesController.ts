import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateImagesService from '@modules/images/services/CreateImageService';

export default class ImagesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;
    const file = request.file.filename;

    const createImage = container.resolve(CreateImagesService);

    const image = await createImage.execute({
      name,
      file,
    });

    return response.json(image);
  }
}
