import { injectable, inject } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';

import Image from '../infra/typeorm/entities/Image';
import IImagesRepository from '../repositories/IImagesRepository';

interface IRequest {
  name: string;
  company_id: string;
}

@injectable()
export default class CreateImageService {
  constructor(
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('ImagesRepository')
    private imagesRepository: IImagesRepository,
  ) {}

  public async execute({ name, company_id }: IRequest): Promise<Image> {
    const img = await this.imagesRepository.findByNameAndCompany(
      name,
      company_id,
    );

    if (!img) {
      throw new AppError('No image with that name.', 401);
    }

    return img;
  }
}
