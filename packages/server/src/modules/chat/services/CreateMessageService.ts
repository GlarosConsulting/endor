import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IWebSocketProvider from '@shared/container/providers/WebSocketProvider/models/IWebSocketProvider';

interface IRequest {
  sender: string;
  content: string;
  channel: string;
}

interface IMessage {
  sender: string;
  content: string;
  channel: string;
}

@injectable()
export default class CreateMessageService {
  constructor(
    @inject('WebSocketProvider')
    private webSocketProvider: IWebSocketProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public execute({ sender, content, channel }: IRequest): IMessage {
    const message = {
      sender,
      content,
      channel,
    };

    this.cacheProvider.save(channel, message);

    this.webSocketProvider.emit({
      to: channel,
      event: 'new-message',
      args: message,
    });

    return message;
  }
}
