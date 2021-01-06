import { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';

import EmployeesRepository from '@modules/employees/infra/typeorm/repositories/EmployeesRepository';

export default async function isMasterUser(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const employeesRepository = new EmployeesRepository();

  const { user } = request;

  const data = await employeesRepository.findById(user.id);

  if (!data?.role) {
    throw new AppError('User not found.', 401);
  }

  if (data.role !== 'master') {
    throw new AppError('User does not have master permissions.', 401);
  }

  next();
}
