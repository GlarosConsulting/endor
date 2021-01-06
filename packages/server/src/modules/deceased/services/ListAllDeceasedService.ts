import { injectable, inject } from 'tsyringe';

import Deceased from '../infra/typeorm/entities/Deceased';
import IDeceasedsRepository from '../repositories/IDeceasedsRepository';

interface IRequest {
  name?: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('DeceasedRepository')
    private deceasedsRepository: IDeceasedsRepository,
  ) {}

  public async execute({ name }: IRequest): Promise<Deceased[] | undefined> {
    let deceaseds;

    if (!name) {
      deceaseds = await this.deceasedsRepository.findAll();
    } else {
      deceaseds = await this.deceasedsRepository.findAllByName(name);
    }

    return deceaseds;
  }
}

export default CreateCustomerService;
