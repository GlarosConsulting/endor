import { injectable, inject } from 'tsyringe';

import Cemetery from '../infra/typeorm/entities/Cemetery';
import ICemeteriesRepository from '../repositories/ICemeteriesRepository';

interface IRequest {
  name: string;
}

@injectable()
class CreateCemeteryService {
  constructor(
    @inject('CemeteriesRepository')
    private cemeteryRepository: ICemeteriesRepository,
  ) {}

  public async execute({ name }: IRequest): Promise<Cemetery> {
    const cemetery = await this.cemeteryRepository.create({
      name,
    });

    return cemetery;
  }
}

export default CreateCemeteryService;
