import { injectable, inject } from 'tsyringe';

import Deceased from '../infra/typeorm/entities/Deceased';
import IDeceasedsRepository from '../repositories/IDeceasedsRepository';

interface IRequest {
  id: string;
}

@injectable()
class FindByDeceasedIdService {
  constructor(
    @inject('DeceasedRepository')
    private deceasedsRepository: IDeceasedsRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Deceased | undefined> {
    const deceased = await this.deceasedsRepository.findById(id);

    return deceased;
  }
}

export default FindByDeceasedIdService;
