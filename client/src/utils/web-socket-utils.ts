import { WebSocketEvent } from '../models/enums/web-socket-event';

type EventHandler = (data?: any) => void;

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
    [WebSocketEvent.VIDEO_OFFER]: function (): void {
      throw new Error('Function not implemented.');
    },
    [WebSocketEvent.VIDEO_ANSWER]: function (): void {
      throw new Error('Function not implemented.');
    },
    [WebSocketEvent.NEW_ICE_CANDIDATE]: function (): void {
      throw new Error('Function not implemented.');
    },
  };

  const messageHandler = (event: MessageEvent<WebSocketEvent | string>) => {
    const data = event.data;
    let key = data;

    console.log('event = ', event.data);

    if (!SOCKET_EVENT_TO_HANDLER_MAP[key as WebSocketEvent]) {
      key = JSON.parse(data).type;
    }

    SOCKET_EVENT_TO_HANDLER_MAP[key as WebSocketEvent](event.data);
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

  export function send(message: any) {
    if (!socket || !socket.readyState) {
      return;
    }

    socket.send(JSON.stringify(message));
  }

  export function registerEventHandler(event: WebSocketEvent, handler: EventHandler) {
    SOCKET_EVENT_TO_HANDLER_MAP[event] = handler;
    console.log(SOCKET_EVENT_TO_HANDLER_MAP);

    if (!socket) {
      return;
    }

    socket.onmessage = messageHandler;
  }
}
