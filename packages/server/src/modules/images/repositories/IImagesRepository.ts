import ICreateImageDTO from '../dtos/ICreateImageDTO';
import Image from '../infra/typeorm/entities/Image';

export default interface IImagesRepository {
  findByName(name: string): Promise<Image | undefined>;
  create(data: ICreateImageDTO): Promise<Image>;
  save(Image: Image): Promise<Image>;
}
