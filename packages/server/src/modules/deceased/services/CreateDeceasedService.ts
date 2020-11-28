import { injectable, inject } from 'tsyringe';

import Deceased from '../infra/typeorm/entities/Deceased';
import IDeceasedsRepository from '../repositories/IDeceasedsRepository';

interface IRequest {
  name: string;
  responsible_id: string;
  funeral_initial_date: Date;
  funeral_final_date: Date;
  sepulting_date: Date;
  live_chat_link: string;
  funeral_location_id: string;
  sepulting_location_id: string;
}

@injectable()
class CreateDeceasedService {
  constructor(
    @inject('DeceasedRepository')
    private deceasedsRepository: IDeceasedsRepository,
  ) {}

  public async execute({
    name,
    responsible_id,
    funeral_initial_date,
    funeral_final_date,
    sepulting_date,
    live_chat_link,
    funeral_location_id,
    sepulting_location_id,
  }: IRequest): Promise<Deceased> {
    const deceased = await this.deceasedsRepository.create({
      name,
      responsible_id,
      funeral_initial_date,
      funeral_final_date,
      sepulting_date,
      live_chat_link,
      funeral_location_id,
      sepulting_location_id,
    });

    return deceased;
  }
}

export default CreateDeceasedService;
