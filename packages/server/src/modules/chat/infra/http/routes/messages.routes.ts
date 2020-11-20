import { Router } from 'express';

import MessagesController from '../controllers/MessagesController';

const messagesRouter = Router();

const messagesController = new MessagesController();

messagesRouter.post('/', messagesController.create);

export default messagesRouter;
