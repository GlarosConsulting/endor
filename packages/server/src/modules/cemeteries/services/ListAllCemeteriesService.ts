import { injectable, inject } from 'tsyringe';

import Cemetery from '../infra/typeorm/entities/Cemetery';
import ICemeteriesRepository from '../repositories/ICemeteriesRepository';

@injectable()
class ListAllCemeteryService {
  constructor(
    @inject('CemeteriesRepository')
    private cemeteryRepository: ICemeteriesRepository,
  ) {}

  public async execute(): Promise<Cemetery[] | undefined> {
    const cemeteries = await this.cemeteryRepository.findAll();
    return cemeteries;
  }
}

export default ListAllCemeteryService;
