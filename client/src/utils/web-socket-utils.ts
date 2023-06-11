export namespace WebSocketUtils {
  let socket: WebSocket | null = null;

  export function connect(userId: number) {
    socket = new WebSocket(
      process.env.REACT_APP_WEB_SOCKET_URL as string,
      userId.toString(),
    );

    socket.onclose = function () {
      connect(userId);
    };
  }

  export function reconnect(userId: number) {
    if (socket) {
      socket.close();
      connect(userId);
    }
  }

  export function registerOnMessageHandler(
    handler: (this: WebSocket, ev: MessageEvent) => any,
  ) {
    if (!socket) {
      return;
    }

    socket.onmessage = handler;
  }
}
