import { getRepository, Repository } from 'typeorm';

import ICreateCemeteryDTO from '@modules/cemeteries/dtos/ICreateCemeteryDTO';
import ICemeteriesRepository from '@modules/cemeteries/repositories/ICemeteriesRepository';

import Cemetery from '../entities/Cemetery';

class CemeteriesRepository implements ICemeteriesRepository {
  private ormRepository: Repository<Cemetery>;

  constructor() {
    this.ormRepository = getRepository(Cemetery);
  }

  public async findAll(): Promise<Cemetery[] | undefined> {
    const cemeteries = await this.ormRepository.find();

    return cemeteries;
  }

  public async findById(id: string): Promise<Cemetery | undefined> {
    const cemetery = await this.ormRepository.findOne(id);

    return cemetery;
  }

  public async create(data: ICreateCemeteryDTO): Promise<Cemetery> {
    const cemetery = this.ormRepository.create(data);

    await this.ormRepository.save(cemetery);

    return cemetery;
  }

  public async save(cemetery: Cemetery): Promise<Cemetery> {
    return this.ormRepository.save(cemetery);
  }
}

export default CemeteriesRepository;
