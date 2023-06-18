export namespace WebSocketUtils {
  let socket: WebSocket | null = null;
  let messageHandler = () => void 0;

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

  export function registerOnMessageHandler(handler: () => any) {
    messageHandler = handler;
    if (!socket) {
      return;
    }

    socket.onmessage = handler;
  }
}
