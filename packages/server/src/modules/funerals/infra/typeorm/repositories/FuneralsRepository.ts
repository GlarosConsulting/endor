import { getRepository, Repository } from 'typeorm';

import ICreateFuneralDTO from '@modules/funerals/dtos/ICreateFuneralDTO';
import IFuneralsRepository from '@modules/funerals/repositories/IFuneralsRepository';

import Funeral from '../entities/Funeral';

class FuneralsRepository implements IFuneralsRepository {
  private ormRepository: Repository<Funeral>;

  constructor() {
    this.ormRepository = getRepository(Funeral);
  }

  public async findById(id: string): Promise<Funeral | undefined> {
    const funeral = await this.ormRepository.findOne({
      where: { id },
      relations: ['cemetery'],
    });
    return funeral;
  }

  public async findByCemeteryId(id: string): Promise<Funeral[] | undefined> {
    const funerals = await this.ormRepository.find({
      where: { cemetery_id: id },
      relations: ['cemetery'],
    });

    return funerals;
  }

  public async findAll(): Promise<Funeral[] | undefined> {
    const funerals = await this.ormRepository.find({
      relations: ['cemetery'],
    });

    return funerals;
  }

  public async create(data: ICreateFuneralDTO): Promise<Funeral> {
    const funeral = this.ormRepository.create(data);

    await this.ormRepository.save(funeral);

    return funeral;
  }

  public async save(funeral: Funeral): Promise<Funeral> {
    return this.ormRepository.save(funeral);
  }
}

export default FuneralsRepository;
