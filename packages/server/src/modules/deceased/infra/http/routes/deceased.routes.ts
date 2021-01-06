import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import DeceasedsController from '../controllers/DeceasedsController';
import FindByDeceasedIdController from '../controllers/FindByDeceasedIdController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const deceasedsRouter = Router();
const deceasedsController = new DeceasedsController();
const findByDeceasedIdController = new FindByDeceasedIdController();

deceasedsRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      responsible_id: Joi.string().uuid().required(),
      funeral_initial_date: Joi.date().required(),
      funeral_final_date: Joi.date().required(),
      sepulting_date: Joi.date().required(),
      funeral_location_id: Joi.string().uuid().required(),
      sepulting_location_id: Joi.string().uuid().required(),
      company_id: Joi.string().uuid(),
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

deceasedsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  findByDeceasedIdController.index,
);

export default deceasedsRouter;
