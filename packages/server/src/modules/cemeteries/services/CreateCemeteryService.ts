import { injectable, inject } from 'tsyringe';

import Cemetery from '../infra/typeorm/entities/Cemetery';
import ICemeteriesRepository from '../repositories/ICemeteriesRepository';

interface IRequest {
  name: string;
  company_id: string;
}

@injectable()
class CreateCemeteryService {
  constructor(
    @inject('CemeteriesRepository')
    private cemeteryRepository: ICemeteriesRepository,
  ) {}

  public async execute({ company_id, name }: IRequest): Promise<Cemetery> {
    const cemetery = await this.cemeteryRepository.create({
      name,
      company_id,
    });

    return cemetery;
  }
}

export default CreateCemeteryService;
