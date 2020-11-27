import { injectable, inject } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IWebSocketProvider from '@shared/container/providers/WebSocketProvider/models/IWebSocketProvider';

interface IRequest {
  sender: string;
  content: string;
  channel: string;
}

interface IMessage {
  id: string;
  sender: string;
  content: string;
}

@injectable()
export default class CreateMessageService {
  constructor(
    @inject('WebSocketProvider')
    private webSocketProvider: IWebSocketProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    sender,
    content,
    channel,
  }: IRequest): Promise<IMessage> {
    const message: IMessage = {
      id: uuidv4(),
      sender,
      content,
    };

    let messages = await this.cacheProvider.recover<IMessage[]>(
      `messages:${channel}`,
    );

    if (!messages) {
      messages = [];
    }

    await this.cacheProvider.save(`messages:${channel}`, [
      ...messages,
      message,
    ]);

    this.webSocketProvider.emit({
      to: channel,
      event: 'new',
      args: message,
    });

    return message;
  }
}
