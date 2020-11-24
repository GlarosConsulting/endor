import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateMessagesService from '@modules/chat/services/CreateMessageService';
import ListChannelMessages from '@modules/chat/services/ListChannelMessages';

export default class MessagesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { sender, content, channel } = request.body;

    const createMessage = container.resolve(CreateMessagesService);

    const message = await createMessage.execute({
      sender,
      content,
      channel,
    });

    return response.json(message);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { channel } = request.params;

    const listMessagesByChannel = container.resolve(ListChannelMessages);

    const messages = await listMessagesByChannel.execute(String(channel));

    return response.json(messages);
  }
}
