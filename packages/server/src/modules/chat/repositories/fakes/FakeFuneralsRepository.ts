import merge from 'lodash/merge';
import { v4 } from 'uuid';

import ICreateFuneralDTO from '../../dtos/ICreateFuneralDTO';
import Funeral from '../../infra/typeorm/entities/Funeral';
import IFuneralsRepository from '../IFuneralsRepository';

class FakeFuneralsRepository implements IFuneralsRepository {
  private funerals: Funeral[] = [];

  public async findByCemeteryId(id: string): Promise<Funeral[] | undefined> {
    const findFuneralByCemetery = this.funerals.filter(
      funeral => funeral.id === id,
    );

    return findFuneralByCemetery;
  }

  public async findAll(): Promise<Funeral[] | undefined> {
    return this.funerals;
  }

  public async create(data: ICreateFuneralDTO): Promise<Funeral> {
    const funeral = new Funeral();

    merge(funeral, { id: v4(), roles: [] }, data);

    this.funerals.push(funeral);

    return funeral;
  }

  public async save(funeral: Funeral): Promise<Funeral> {
    const findIndex = this.funerals.findIndex(
      findFuneral => findFuneral.id === funeral.id,
    );

    this.funerals[findIndex] = funeral;

    return funeral;
  }
}

export default FakeFuneralsRepository;
