import { Router } from 'express';

import cemeteriesRouter from '@modules/cemeteries/infra/http/routes/cemeteries.routes';
import messagesRouter from '@modules/chat/infra/socket/routes/routes';
import customersRouter from '@modules/customers/infra/http/routes/customers.routes';
import deceasedsRouter from '@modules/deceased/infra/http/routes/deceased.routes';
import employeesRouter from '@modules/employees/infra/http/routes/employees.routes';
import profileRouter from '@modules/employees/infra/http/routes/profile.routes';
import sessionsRouter from '@modules/employees/infra/http/routes/sessions.routes';
import funeralsRouter from '@modules/funerals/infra/http/routes/funerals.routes';

const routes = Router();

routes.use('/cemeteries', cemeteriesRouter);
routes.use('/customers', customersRouter);
routes.use('/deceaseds', deceasedsRouter);
routes.use('/employees', employeesRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/profile', profileRouter);
routes.use('/funerals', funeralsRouter);
routes.use('/messages', messagesRouter);
routes.get('/', (_request, response) =>
  response.json({
    name: 'Endor API',
    version: '1.0.0',
  }),
);

export default routes;
