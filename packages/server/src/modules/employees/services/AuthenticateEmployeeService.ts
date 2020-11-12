import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authenticationConfig from '@config/authentication';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Employee from '../infra/typeorm/entities/Employee';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IEmployeeRepository from '../repositories/IEmployeesRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  employee: Employee;
  access_token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateEmployeeService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeeRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const employee = await this.employeesRepository.findByEmail(email);

    if (!employee) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      employee.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const {
      accessTokenSecret,
      refreshTokenSecret,
      expiresIn,
    } = authenticationConfig.jwt;

    const access_token = sign({}, accessTokenSecret, {
      subject: employee.id,
      expiresIn,
    });

    const refresh_token = sign({}, refreshTokenSecret, {
      subject: employee.id,
    });

    const recoveredRefreshTokens = await this.cacheProvider.recover<
      Record<string, string>
    >('refresh-tokens');

    const refreshTokens = recoveredRefreshTokens || {};

    refreshTokens[employee.id] = refresh_token;

    await this.cacheProvider.save('refresh-tokens', refreshTokens);

    return { employee, access_token, refresh_token };
  }
}

export default AuthenticateEmployeeService;
