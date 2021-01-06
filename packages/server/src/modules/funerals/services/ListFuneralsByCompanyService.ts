import { injectable, inject } from 'tsyringe';

import Funeral from '../infra/typeorm/entities/Funeral';
import IFuneralsRepository from '../repositories/IFuneralsRepository';

@injectable()
class ListAllfuneralsService {
  constructor(
    @inject('FuneralsRepository')
    private funeralsRepository: IFuneralsRepository,
  ) {}

  public async execute(company_id: string): Promise<Funeral[] | undefined> {
    const funerals = await this.funeralsRepository.findAllByCompany(company_id);

    return funerals;
  }
}

export default ListAllfuneralsService;
