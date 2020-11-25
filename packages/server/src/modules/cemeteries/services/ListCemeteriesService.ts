import { injectable, inject } from 'tsyringe';

import Cemetery from '../infra/typeorm/entities/Cemetery';
import ICemeteriesRepository from '../repositories/ICemeteriesRepository';

interface IRequest {
  name?: string;
}

@injectable()
class ListAllCemeteryService {
  constructor(
    @inject('CemeteriesRepository')
    private cemeteryRepository: ICemeteriesRepository,
  ) {}

  public async execute({ name }: IRequest): Promise<Cemetery[] | undefined> {
    let cemeteries;

    if (!name) {
      cemeteries = await this.cemeteryRepository.findAll();
    } else {
      cemeteries = await this.cemeteryRepository.findByName(name);
    }
    return cemeteries;
  }
}

export default ListAllCemeteryService;
