import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import CompaniesController from '../controllers/CompaniesController';
import FindCompanyByIdController from '../controllers/FindCompanyByIdController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import isMasterUser from '../middlewares/isMasterUser';

const companiesRouter = Router();
const findCompanyByIdController = new FindCompanyByIdController();
const companiesController = new CompaniesController();

companiesRouter.get('/', ensureAuthenticated, companiesController.index);

companiesRouter.get(
  '/:company_id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      company_id: Joi.string().uuid().required(),
    },
  }),
  findCompanyByIdController.index,
);

companiesRouter.post(
  '/',
  ensureAuthenticated,
  isMasterUser,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
    },
  }),
  companiesController.create,
);

export default companiesRouter;
