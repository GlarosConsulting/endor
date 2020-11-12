import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/employees/services/AuthenticateEmployeeService';
import LogOutUserService from '@modules/employees/services/LogOutUserService';
import RefreshAccessTokenService from '@modules/employees/services/RefreshAccessTokenService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const {
      employee,
      access_token,
      refresh_token,
    } = await authenticateUser.execute({
      email,
      password,
    });

    return response.json({
      user: classToClass(employee),
      access_token,
      refresh_token,
    });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { refresh_token } = request.body;

    const refreshAccessToken = container.resolve(RefreshAccessTokenService);

    const { access_token } = await refreshAccessToken.execute({
      refresh_token,
    });

    return response.json({ access_token });
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { access_token } = request.body;

    const logOutUser = container.resolve(LogOutUserService);

    await logOutUser.execute({
      access_token,
    });

    return response.json().send();
  }
}
