import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IMessage {
  sender: string;
  content: string;
}

@injectable()
export default class CreateMessageService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(channel: string): Promise<IMessage[]> {
    let messages = await this.cacheProvider.recover<IMessage[]>(
      `messages:${channel}`,
    );

    if (!messages) {
      messages = [];
    }
    return messages;
  }
}
