import { WebSocketEvent } from '../models/enums/web-socket-event';
import { WebSocketUtils } from '../utils/web-socket-utils';
import { createRTCConnection } from './web-rtc-service';

export let rtcConnection: RTCPeerConnection | null = null;

export async function requestMediaDevicesPermission() {
  const mediaDevices = navigator.mediaDevices;
  const mediaStream = await mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  return mediaStream;
}

async function exchangeCallSessionDescription(
  rtcConnection: RTCPeerConnection,
  caller: number,
  callee: number,
) {
  rtcConnection.onnegotiationneeded = async () => {
    const videoOffer = await rtcConnection.createOffer();
    await rtcConnection.setLocalDescription(videoOffer);

    WebSocketUtils.send({
      userId: caller,
      targetUserId: callee,
      type: 'video-offer',
      sdp: rtcConnection.localDescription,
    });
  };
}

async function negotiateICECandidate(
  rtcConnection: RTCPeerConnection,
  caller: number,
  callee: number,
) {
  rtcConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      WebSocketUtils.send({
        userId: caller,
        targetUserId: callee,
        type: 'new-ice-candidate',
        candidate: event.candidate,
      });
    }
  };
}

function handleOnTrackEvent(
  rtcConnection: RTCPeerConnection,
  assignVideoStreamCallback: (stream: MediaStream) => void,
) {
  rtcConnection.ontrack = (trackEvent) => {
    assignVideoStreamCallback(trackEvent.streams[0]);
  };
}

function closeConnection() {
  if (rtcConnection === null) {
    return;
  }

  rtcConnection.close();
  rtcConnection.onicecandidate = null;
  rtcConnection.ontrack = null;
  rtcConnection.onnegotiationneeded = null;
  rtcConnection = null;
}

function handleCallEnd(hangUpCallback: () => void) {
  WebSocketUtils.registerEventHandler(WebSocketEvent.END_CALL, () => {
    hangUpCallback();
    closeConnection();
  });
}

export function hangUp(calleeId: number, hangUpCallback: () => void) {
  WebSocketUtils.send({
    targetUserId: calleeId,
    type: WebSocketEvent.END_CALL,
  });
  window.location.reload();
  closeConnection();
}

export async function startVideoCallSession(
  caller: number,
  callee: number,
  assignCallerStream: (stream: MediaStream) => void,
  assignStream: (stream: MediaStream) => void,
  hangUpCallback: () => void,
) {
  if (rtcConnection) {
    throw new Error('Already in a call');
  }

  rtcConnection = createRTCConnection();

  handleOnTrackEvent(rtcConnection, assignStream);
  negotiateICECandidate(rtcConnection, caller, callee);
  exchangeCallSessionDescription(rtcConnection, caller, callee);
  handleCallEnd(hangUpCallback);

  const mediaStream = await requestMediaDevicesPermission();

  assignCallerStream(mediaStream);

  mediaStream.getTracks().forEach((track) => {
    rtcConnection?.addTrack(track, mediaStream);
  });

  return rtcConnection;
}

export function registerWebRTCEventHandler() {
  WebSocketUtils.registerEventHandler(
    WebSocketEvent.NEW_ICE_CANDIDATE,
    (newICECandidateEventAsString) => {
      if (!rtcConnection) {
        return;
      }

      const newICECandidateEvent = JSON.parse(newICECandidateEventAsString);
      rtcConnection.addIceCandidate(newICECandidateEvent.candidate);
    },
  );

  WebSocketUtils.registerEventHandler(
    WebSocketEvent.VIDEO_ANSWER,
    (videoAnswerAsString) => {
      if (!rtcConnection) {
        return;
      }

      const videoAnswer = JSON.parse(videoAnswerAsString);
      const sessionDescription = new RTCSessionDescription(videoAnswer.sdp);

      rtcConnection.setRemoteDescription(sessionDescription);
    },
  );
}

export async function joinVideoCallSession(
  videoOfferEventAsString: string,
  assignCallerStream: (stream: MediaStream) => void,
  assignStream: (stream: MediaStream) => void,
  hangUpCallback: () => void,
) {
  const videoOfferEvent = JSON.parse(videoOfferEventAsString);
  const { userId, targetUserId } = videoOfferEvent;

  if (rtcConnection) {
    throw new Error('Already in a call');
  }

  rtcConnection = createRTCConnection();

  handleOnTrackEvent(rtcConnection, assignStream);
  negotiateICECandidate(rtcConnection, targetUserId, userId);
  exchangeCallSessionDescription(rtcConnection, targetUserId, userId);
  handleCallEnd(hangUpCallback);

  const sessionDescription = new RTCSessionDescription(videoOfferEvent.sdp);
  await rtcConnection.setRemoteDescription(sessionDescription);

  const mediaStream = await requestMediaDevicesPermission();

  assignCallerStream(mediaStream);

  mediaStream.getTracks().forEach((track) => {
    rtcConnection?.addTrack(track, mediaStream);
  });

  const answer = await rtcConnection.createAnswer();
  await rtcConnection.setLocalDescription(answer);

  WebSocketUtils.send({
    userId: targetUserId,
    targetUserId: userId,
    type: 'video-answer',
    sdp: rtcConnection.localDescription,
  });
}
