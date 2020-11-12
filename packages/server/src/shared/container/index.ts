import { container } from 'tsyringe';

import '@modules/employees/providers';

import './providers';

import CemeteriesRepository from '@modules/cemeteries/infra/typeorm/repositories/CemeteriesRepository';
import ICemeteriesRepository from '@modules/cemeteries/repositories/ICemeteriesRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import DeceasedRepository from '@modules/deceased/infra/typeorm/repositories/DeceasedsRepository';
import IDeceasedRepository from '@modules/deceased/repositories/IDeceasedsRepository';
import EmnployeesRepository from '@modules/employees/infra/typeorm/repositories/EmployeesRepository';
import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import FuneralsRepository from '@modules/funerals/infra/typeorm/repositories/UsersRepository';
import IFuneralsRepository from '@modules/funerals/repositories/IFuneralsRepository';

container.registerSingleton<ICustomersRepository>(
  'CustomersRepository',
  CustomersRepository,
);

container.registerSingleton<ICemeteriesRepository>(
  'CemeteriesRepository',
  CemeteriesRepository,
);

container.registerSingleton<IDeceasedRepository>(
  'DeceasedRepository',
  DeceasedRepository,
);

container.registerSingleton<IEmployeesRepository>(
  'EmployeesRepository',
  EmnployeesRepository,
);

container.registerSingleton<IFuneralsRepository>(
  'FuneralsRepository',
  FuneralsRepository,
);
