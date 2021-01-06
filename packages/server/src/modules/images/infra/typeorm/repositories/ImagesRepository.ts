import { getRepository, Repository } from 'typeorm';

import ICreateImageDTO from '@modules/images/dtos/ICreateImageDTO';
import IImagesRepository from '@modules/images/repositories/IImagesRepository';

import Image from '../entities/Image';

class ImagesRepository implements IImagesRepository {
  private ormRepository: Repository<Image>;

  constructor() {
    this.ormRepository = getRepository(Image);
  }

  public async findByNameAndCompany(
    name: string,
    company_id: string,
  ): Promise<Image | undefined> {
    const image = await this.ormRepository.findOne({
      where: { name, company_id },
    });

    return image;
  }

  public async create(data: ICreateImageDTO): Promise<Image> {
    const image = this.ormRepository.create(data);

    await this.ormRepository.save(image);

    return image;
  }

  public async save(img: Image): Promise<Image> {
    return this.ormRepository.save(img);
  }
}

export default ImagesRepository;
