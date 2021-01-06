import { injectable, inject } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import Image from '../infra/typeorm/entities/Image';
import IImagesRepository from '../repositories/IImagesRepository';

interface IRequest {
  name: string;
  file: string;
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

  public async execute({ name, company_id, file }: IRequest): Promise<Image> {
    const img = await this.imagesRepository.findByNameAndCompany(
      name,
      company_id,
    );

    if (!img) {
      const filename = await this.storageProvider.saveFile(file);

      const createdImage = await this.imagesRepository.create({
        name,
        company_id,
        file: filename,
      });

      return createdImage;
    }

    if (img.file) {
      await this.storageProvider.deleteFile(img.file);
    }

    const filename = await this.storageProvider.saveFile(file);

    img.file = filename;

    await this.imagesRepository.save(img);

    return img;
  }
}
