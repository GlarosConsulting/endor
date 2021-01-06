import { container } from 'tsyringe';

import '@modules/employees/providers';

import './providers';

import CemeteriesRepository from '@modules/cemeteries/infra/typeorm/repositories/CemeteriesRepository';
import ICemeteriesRepository from '@modules/cemeteries/repositories/ICemeteriesRepository';
import CompaniesRepository from '@modules/companies/infra/typeorm/repositories/CompaniesRepository';
import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import DeceasedRepository from '@modules/deceased/infra/typeorm/repositories/DeceasedsRepository';
import IDeceasedRepository from '@modules/deceased/repositories/IDeceasedsRepository';
import EmnployeesRepository from '@modules/employees/infra/typeorm/repositories/EmployeesRepository';
import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import FuneralsRepository from '@modules/funerals/infra/typeorm/repositories/FuneralsRepository';
import IFuneralsRepository from '@modules/funerals/repositories/IFuneralsRepository';
import ImagesRepository from '@modules/images/infra/typeorm/repositories/ImagesRepository';
import IImagesRepository from '@modules/images/repositories/IImagesRepository';

container.registerSingleton<ICustomersRepository>(
  'CustomersRepository',
  CustomersRepository,
);

container.registerSingleton<ICompaniesRepository>(
  'CompaniesRepository',
  CompaniesRepository,
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

container.registerSingleton<IImagesRepository>(
  'ImagesRepository',
  ImagesRepository,
);
