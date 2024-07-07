export function createRTCConnection() {
  const rtcConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: 'stun:stun.stunprotocol.org',
      },
    ],
  });

  return rtcConnection;
}
