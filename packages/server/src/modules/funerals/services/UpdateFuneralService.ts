import { merge } from 'lodash';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Funeral from '../infra/typeorm/entities/Funeral';
import IFuneralsRepository from '../repositories/IFuneralsRepository';

interface IRequest {
  id: string;
  name: string;
  url_cam: string;
}

@injectable()
class UpdateFuneralService {
  constructor(
    @inject('FuneralsRepository')
    private funeralsRepository: IFuneralsRepository,
  ) {}

  public async execute({ id, name, url_cam }: IRequest): Promise<Funeral> {
    const funeral = await this.funeralsRepository.findById(id);

    if (!funeral) {
      throw new AppError('funeral not found.');
    }

    if (!name) {
      throw new AppError('funeral is required.');
    }

    if (!url_cam) {
      throw new AppError('url cam is required.');
    }

    merge(funeral, { name, url_cam });

    return this.funeralsRepository.save(funeral);
  }
}

export default UpdateFuneralService;
