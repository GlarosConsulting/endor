import { injectable, inject } from 'tsyringe';

import Funeral from '@modules/funerals/infra/typeorm/entities/Funeral';
import IFuneralsRepository from '@modules/funerals/repositories/IFuneralsRepository';

interface IRequest {
  id: string;
}

@injectable()
class CreateFuneralservice {
  constructor(
    @inject('FuneralsRepository')
    private funeralsRepository: IFuneralsRepository,
  ) {}

  public async execute(id: string): Promise<Funeral | undefined> {
    const funeral = await this.funeralsRepository.findById(id);

    return funeral;
  }
}

export default CreateFuneralservice;
