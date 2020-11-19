import { injectable, inject } from 'tsyringe';

import Funeral from '../infra/typeorm/entities/Funeral';
import IFuneralsRepository from '../repositories/IFuneralsRepository';

@injectable()
class FindByCemeteryIdService {
  constructor(
    @inject('FuneralsRepository')
    private funeralsRepository: IFuneralsRepository,
  ) {}

  public async execute(cemetery_id: string): Promise<Funeral[] | undefined> {
    const funeral = await this.funeralsRepository.findByCemeteryId(cemetery_id);

    return funeral;
  }
}

export default FindByCemeteryIdService;
