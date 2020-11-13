import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import FuneralsController from '../controllers/FuneralsController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const funeralsRouter = Router();
const funeralsController = new FuneralsController();

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

funeralsRouter.get('/', ensureAuthenticated, funeralsController.index);

export default funeralsRouter;
