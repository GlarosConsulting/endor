import merge from 'lodash/merge';
import { v4 } from 'uuid';

import ICreateCemeteryDTO from '../../dtos/ICreateCemeteryDTO';
import Cemetery from '../../infra/typeorm/entities/Cemetery';
import ICemeteriesRepository from '../ICemeteriesRepository';

class FakeCemeteriesRepository implements ICemeteriesRepository {
  private cemeteries: Cemetery[] = [];

  public async findAll(): Promise<Cemetery[] | undefined> {
    const findCemetery = this.cemeteries;

    return findCemetery;
  }

  public async findById(id: string): Promise<Cemetery | undefined> {
    const findCemetery = this.cemeteries.find(cemetery => cemetery.id === id);

    return findCemetery;
  }

  public async create(data: ICreateCemeteryDTO): Promise<Cemetery> {
    const cemetery = new Cemetery();

    merge(cemetery, { id: v4() }, data);

    this.cemeteries.push(cemetery);

    return cemetery;
  }

  public async save(cemetery: Cemetery): Promise<Cemetery> {
    const findIndex = this.cemeteries.findIndex(
      findCemetery => findCemetery.id === cemetery.id,
    );

    this.cemeteries[findIndex] = cemetery;

    return cemetery;
  }
}

export default FakeCemeteriesRepository;
