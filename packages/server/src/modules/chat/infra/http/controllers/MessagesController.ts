import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateMessagesService from '@modules/chat/services/CreateMessageService';

export default class MessagesController {
  public create(request: Request, response: Response): Response {
    const { sender, content, channel } = request.body;

    const createMessage = container.resolve(CreateMessagesService);

    const message = createMessage.execute({
      sender,
      content,
      channel,
    });

    return response.json(message);
  }
}
