import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import CemeteriesController from '../controllers/CemeteriesController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const cemeteriesRouter = Router();
const cemeteriesController = new CemeteriesController();

cemeteriesRouter.get('/', ensureAuthenticated, cemeteriesController.index);

cemeteriesRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
    },
  }),
  cemeteriesController.create,
);

export default cemeteriesRouter;
