export async function createRTCConnection() {
  const response = await fetch(
    `${process.env.REACT_APP_WEB_METERED_URL}/api/v1/turn/credentials?apiKey=${process.env.REACT_APP_WEB_METERED_TURN_SERVER_API_KEY}`,
  );

  // Saving the response in the iceServers array
  const iceServers: RTCIceServer[] = await response.json();

  iceServers.push({
    urls: 'stun:stun.l.google.com:19302',
  });

  const rtcConnection = new RTCPeerConnection({
    iceServers: iceServers,
  });

  return rtcConnection;
}
