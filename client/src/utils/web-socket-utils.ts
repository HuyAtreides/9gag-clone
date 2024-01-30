import { WebSocketEvent } from '../models/enums/web-socket-event';

type EventHandler = () => void;

export namespace WebSocketUtils {
  let socket: WebSocket | null = null;
  const SOCKET_EVENT_TO_HANDLER_MAP: Record<WebSocketEvent, EventHandler> = {
    [WebSocketEvent.RECEIVE_NEW_NOTIFICATION]: function (): void {
      throw new Error('Function not implemented.');
    },
    [WebSocketEvent.EDIT_MESSAGE]: () => {
      throw new Error('Function not implemented.');
    },
    [WebSocketEvent.REMOVE_MESSAGE]: () => {
      throw new Error('Function not implemented.');
    },
    [WebSocketEvent.PIN_MESSAGE]: () => {
      throw new Error('Function not implemented.');
    },
    [WebSocketEvent.MARK_AS_READ]: () => {
      throw new Error('Function not implemented.');
    },
    [WebSocketEvent.RECEIVE_NEW_MESSAGE]: () => {
      throw new Error('Function not implemented.');
    },
    [WebSocketEvent.BLOCK_USER]: function (): void {
      throw new Error('Function not implemented.');
    },
  };

  const messageHandler = (event: MessageEvent<WebSocketEvent>) => {
    const data = event.data;
    SOCKET_EVENT_TO_HANDLER_MAP[data]();
  };

  export function connect(userId: number) {
    socket = new WebSocket(
      process.env.REACT_APP_WEB_SOCKET_URL as string,
      userId.toString(),
    );

    socket.onclose = function () {
      connect(userId);
    };

    socket.onmessage = messageHandler;
  }

  export function reconnect(userId: number) {
    if (socket) {
      socket.close();
      connect(userId);
    }
  }

  export function registerEventHandler(event: WebSocketEvent, handler: EventHandler) {
    SOCKET_EVENT_TO_HANDLER_MAP[event] = handler;

    if (!socket) {
      return;
    }

    socket.onmessage = messageHandler;
  }
}
