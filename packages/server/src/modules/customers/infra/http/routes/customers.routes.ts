import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import CustomersController from '../controllers/CustomersController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const customersController = new CustomersController();

usersRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      telephone: Joi.string().required(),
      gender: Joi.string().required(),
      cpf: Joi.string().length(11),
      birth_date: Joi.date().required(),
    },
  }),
  customersController.create,
);

usersRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string().allow(null),
    },
  }),
  customersController.index,
);

export default usersRouter;
