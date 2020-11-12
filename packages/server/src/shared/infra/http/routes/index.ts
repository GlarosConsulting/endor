import { Router } from 'express';

import cemeteriesRouter from '@modules/cemeteries/infra/http/routes/cemeteries.routes';
import customersRouter from '@modules/customers/infra/http/routes/customers.routes';
import employeesRouter from '@modules/employees/infra/http/routes/employees.routes';
import profileRouter from '@modules/employees/infra/http/routes/profile.routes';
import sessionsRouter from '@modules/employees/infra/http/routes/sessions.routes';

const routes = Router();

routes.use('/cemeteries', cemeteriesRouter);
routes.use('/customers', customersRouter);
routes.use('/employees', employeesRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/profile', profileRouter);

routes.get('/', (_request, response) =>
  response.json({
    name: 'Endor API',
    version: '1.0.0',
  }),
);

export default routes;
