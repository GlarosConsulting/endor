import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import EmployeesController from '../controllers/EmployeesController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const employeesRouter = Router();
const employeesController = new EmployeesController();

employeesRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      role: Joi.string(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    },
  }),
  employeesController.create,
);

employeesRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string().allow(null),
    },
  }),
  employeesController.index,
);

export default employeesRouter;
