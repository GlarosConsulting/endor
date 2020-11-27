import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import FuneralByCemeteryIdController from '../controllers/FuneralByCemeteryIdController';
import FuneralsController from '../controllers/FuneralsController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const funeralsRouter = Router();
const funeralsController = new FuneralsController();
const funeralByCemeteryController = new FuneralByCemeteryIdController();

funeralsRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      url_cam: Joi.string().required(),
      cemetery_id: Joi.string().uuid().required(),
    },
  }),
  funeralsController.create,
);

funeralsRouter.put(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid(),
      name: Joi.string(),
      url_cam: Joi.string(),
    },
  }),
  funeralsController.update,
);

funeralsRouter.get('/', ensureAuthenticated, funeralsController.index);

funeralsRouter.get(
  '/cemetery/:cemetery_id',
  ensureAuthenticated,
  funeralByCemeteryController.index,
);

export default funeralsRouter;
