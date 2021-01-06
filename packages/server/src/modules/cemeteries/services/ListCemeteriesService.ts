import { injectable, inject } from 'tsyringe';

import Cemetery from '../infra/typeorm/entities/Cemetery';
import ICemeteriesRepository from '../repositories/ICemeteriesRepository';

interface IRequest {
  name?: string;
  company_id: string;
}

@injectable()
class ListAllCemeteryService {
  constructor(
    @inject('CemeteriesRepository')
    private cemeteryRepository: ICemeteriesRepository,
  ) {}

  public async execute({
    company_id,
    name,
  }: IRequest): Promise<Cemetery[] | undefined> {
    let cemeteries;

    if (!name) {
      cemeteries = await this.cemeteryRepository.findByCompany(company_id);
    } else {
      cemeteries = await this.cemeteryRepository.findByName(name, company_id);
    }
    return cemeteries;
  }
}

export default ListAllCemeteryService;
