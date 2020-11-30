import { getRepository, Like, Repository } from 'typeorm';

import ICreateDeceasedDTO from '@modules/deceased/dtos/ICreateDeceasedDTO';
import IDeceasedsRepository from '@modules/deceased/repositories/IDeceasedsRepository';

import Deceased from '../entities/Deceased';

class DeceasedsRepository implements IDeceasedsRepository {
  private ormRepository: Repository<Deceased>;

  constructor() {
    this.ormRepository = getRepository(Deceased);
  }

  public async findByName(name: string): Promise<Deceased[] | undefined> {
    const deceased = await this.ormRepository.find({
      where: { name: Like(`%${name}%`) },
      relations: [
        'responsible',
        'funeral_location',
        'funeral_location.cemetery',
        'sepulting_location',
      ],
    });

    return deceased;
  }

  public async findAll(): Promise<Deceased[] | undefined> {
    const deceaseds = await this.ormRepository.find({
      relations: [
        'responsible',
        'funeral_location',
        'funeral_location.cemetery',
        'sepulting_location',
      ],
    });

    return deceaseds;
  }

  public async findById(id: string): Promise<Deceased | undefined> {
    const deceased = await this.ormRepository.findOne({
      where: { id },
      relations: [
        'responsible',
        'funeral_location',
        'funeral_location.cemetery',
        'sepulting_location',
      ],
    });

    return deceased;
  }

  public async create(data: ICreateDeceasedDTO): Promise<Deceased> {
    const deceased = this.ormRepository.create(data);

    await this.ormRepository.save(deceased);

    return deceased;
  }

  public async save(deceased: Deceased): Promise<Deceased> {
    return this.ormRepository.save(deceased);
  }
}

export default DeceasedsRepository;
