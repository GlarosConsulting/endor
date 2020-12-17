import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/cemeteries/infra/http/middlewares/ensureAuthenticated';

import FindImageByName from '../controllers/FindImageByName';
import ImagesController from '../controllers/ImagesController';

const imagesRouter = Router();

const imagesController = new ImagesController();
const findImageByName = new FindImageByName();

const upload = multer(uploadConfig.multer);

imagesRouter.post('/', upload.single('file'), imagesController.create);

imagesRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string(),
    },
  }),
  findImageByName.show,
);
export default imagesRouter;
