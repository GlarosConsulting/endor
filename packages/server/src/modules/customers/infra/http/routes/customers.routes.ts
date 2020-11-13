import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import CustomersController from '../controllers/CustomersController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const customersRouter = Router();
const customersController = new CustomersController();

customersRouter.post(
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

customersRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string().allow(null),
    },
  }),
  customersController.index,
);

export default customersRouter;
