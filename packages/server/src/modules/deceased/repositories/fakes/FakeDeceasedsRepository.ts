import merge from 'lodash/merge';
import { v4 } from 'uuid';

import ICreateDeceasedDTO from '../../dtos/ICreateDeceasedDTO';
import Deceased from '../../infra/typeorm/entities/Deceased';
import IDeceasedRepository from '../IDeceasedsRepository';

class FakeDeceasedRepository implements IDeceasedRepository {
  private deceaseds: Deceased[] = [];

  public async findByName(name: string): Promise<Deceased[] | undefined> {
    const findDeceased = this.deceaseds.filter(user => user.name === name);

    return findDeceased;
  }

  public async findAll(): Promise<Deceased[] | undefined> {
    const deceasedList = this.deceaseds;

    return deceasedList;
  }

  public async create(data: ICreateDeceasedDTO): Promise<Deceased> {
    const deceased = new Deceased();

    merge(deceased, { id: v4(), roles: [] }, data);

    this.deceaseds.push(deceased);

    return deceased;
  }

  public async save(deceased: Deceased): Promise<Deceased> {
    const findIndex = this.deceaseds.findIndex(
      findDeceased => findDeceased.id === deceased.id,
    );

    this.deceaseds[findIndex] = deceased;

    return deceased;
  }
}

export default FakeDeceasedRepository;
