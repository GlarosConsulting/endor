import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import DeceasedsController from '../controllers/DeceasedsController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const deceasedsRouter = Router();
const deceasedsController = new DeceasedsController();

deceasedsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      responsible_id: Joi.string().uuid().required(),
      funeral_initial_date: Joi.date().required(),
      funeral_final_date: Joi.date().required(),
      sepulting_date: Joi.date().required(),
      funeral_id: Joi.string().uuid().required(),
    },
  }),
  deceasedsController.create,
);

deceasedsRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string().allow(null),
    },
  }),
  deceasedsController.index,
);

export default deceasedsRouter;
