import { injectable, inject } from 'tsyringe';

import Funeral from '../infra/typeorm/entities/Funeral';
import IFuneralsRepository from '../repositories/IFuneralsRepository';

interface IRequest {
  name: string;
  url_cam: string;
  cemetery_id: string;
  company_id: string;
}

@injectable()
class CreateFuneralService {
  constructor(
    @inject('FuneralsRepository')
    private funeralsRepository: IFuneralsRepository,
  ) {}

  public async execute({
    name,
    url_cam,
    cemetery_id,
    company_id,
  }: IRequest): Promise<Funeral> {
    const funeral = await this.funeralsRepository.create({
      name,
      url_cam,
      cemetery_id,
      company_id,
    });

    return funeral;
  }
}

export default CreateFuneralService;
