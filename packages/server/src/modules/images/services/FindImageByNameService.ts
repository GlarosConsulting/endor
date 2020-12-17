import { injectable, inject } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';

import Image from '../infra/typeorm/entities/Image';
import IImagesRepository from '../repositories/IImagesRepository';

interface IRequest {
  name: string;
}

@injectable()
export default class CreateImageService {
  constructor(
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('ImagesRepository')
    private imagesRepository: IImagesRepository,
  ) {}

  public async execute({ name }: IRequest): Promise<Image> {
    const img = await this.imagesRepository.findByName(name);

    if (!img) {
      throw new AppError('No image with that name.', 401);
    }

    return img;
  }
}
