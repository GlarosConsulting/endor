import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import CemeteriesController from '../controllers/CemeteriesController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const cemeteriesRouter = Router();
const cemeteriesController = new CemeteriesController();

cemeteriesRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string().allow(null),
      company_id: Joi.string().allow(null),
    },
  }),
  cemeteriesController.index,
);

cemeteriesRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      company_id: Joi.string().uuid(),
    },
  }),
  cemeteriesController.create,
);

export default cemeteriesRouter;
