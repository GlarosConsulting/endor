import { Server } from 'http';
import socketio from 'socket.io';
import { injectable, inject } from 'tsyringe';

import IWebSocketProvider from '@shared/container/providers/WebSocketProvider/models/IWebSocketProvider';

@injectable()
export default class WebSocket {
  constructor(
    @inject('WebSocketProvider')
    private webSocketProvider: IWebSocketProvider,
  ) {}

  public async start(server: Server): Promise<void> {
    const io: socketio.Server = await this.webSocketProvider.create(server);

    io.on('connection', socket => {
      const { username } = socket.handshake.query;

      this.webSocketProvider.connect(username, socket.id);

      socket.on('join', room => {
        socket.join(room);
      });

      socket.on('leave', room => {
        socket.leave(room);
      });

      socket.on('disconnect', () => {
        this.webSocketProvider.disconnect(username);
      });
    });
  }
}
