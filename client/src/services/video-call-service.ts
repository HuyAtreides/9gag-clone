import { WebSocketEvent } from '../models/enums/web-socket-event';
import { WebSocketUtils } from '../utils/web-socket-utils';
import { createRTCConnection } from './web-rtc-service';

let rtcConnection: RTCPeerConnection;

export async function requestMediaDevicesPermission() {
  const mediaDevices = navigator.mediaDevices;
  const mediaStream = await mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  return mediaStream;
}

async function exchangeCallSessionDescription(caller: number, callee: number) {
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

  WebSocketUtils.registerEventHandler(
    WebSocketEvent.VIDEO_ANSWER,
    async (videoAnswerAsString) => {
      const videoAnswer = JSON.parse(videoAnswerAsString);
      const sessionDescription = new RTCSessionDescription(videoAnswer.sdp);

      await rtcConnection.setRemoteDescription(sessionDescription);
    },
  );
}

async function negotiateICECandidate(caller: number, callee: number) {
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

  WebSocketUtils.registerEventHandler(
    WebSocketEvent.NEW_ICE_CANDIDATE,
    async (newICECandidateEventAsString) => {
      const newICECandidateEvent = JSON.parse(newICECandidateEventAsString);
      await rtcConnection.addIceCandidate(
        new RTCIceCandidate(newICECandidateEvent.candidate),
      );
      console.log('add ICE candidate', newICECandidateEvent);
    },
  );
}

function handleOnTrackEvent(assignVideoStreamCallback: (stream: MediaStream) => void) {
  rtcConnection.ontrack = (trackEvent) => {
    assignVideoStreamCallback(trackEvent.streams[0]);
  };
}

export function endCall() {
  if (rtcConnection === undefined) {
    return;
  }

  rtcConnection.close();
  rtcConnection.onicecandidate = null;
  rtcConnection.ontrack = null;
  rtcConnection.onnegotiationneeded = null;
}

export async function startVideoCallSession(
  caller: number,
  callee: number,
  mediaStream: MediaStream,
  assignStream: (stream: MediaStream) => void,
) {
  if (rtcConnection !== undefined) {
    throw new Error('Already in a call');
  }

  rtcConnection = createRTCConnection();

  handleOnTrackEvent(assignStream);
  negotiateICECandidate(caller, callee);
  exchangeCallSessionDescription(caller, callee);

  mediaStream.getTracks().forEach((track) => {
    rtcConnection.addTrack(track, mediaStream);
  });

  return rtcConnection;
}

export async function joinVideoCallSession(
  videoOfferEventAsString: string,
  mediaStream: MediaStream,
  assignStream: (stream: MediaStream) => void,
) {
  const videoOfferEvent = JSON.parse(videoOfferEventAsString);
  const { userId, targetUserId } = videoOfferEvent;
  startVideoCallSession(targetUserId, userId, mediaStream, assignStream);

  const sessionDescription = new RTCSessionDescription(videoOfferEvent.sdp);
  await rtcConnection.setRemoteDescription(sessionDescription);
  const answer = await rtcConnection.createAnswer();
  await rtcConnection.setLocalDescription(answer);
  WebSocketUtils.send({
    userId: targetUserId,
    targetUserId: userId,
    type: 'video-answer',
    sdp: rtcConnection.localDescription,
  });
}
