import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface VideoCallState {
  readonly calleeId: number;
  readonly calling: boolean;
  readonly receiveCall: boolean;
  readonly callerVideoStream: MediaStream | null;
  readonly calleeVideoStream: MediaStream | null;
  readonly callEnded: boolean;
  readonly openCallVideo: boolean;
  readonly calleeImgUrl: string;
  readonly calleeName: string;
}

const initialState: VideoCallState = {
  openCallVideo: false,
  calleeId: 0,
  receiveCall: false,
  calleeImgUrl: '',
  calleeName: '',
  calling: false,
  callerVideoStream: null,
  calleeVideoStream: null,
  callEnded: false,
};

const slice = createSlice({
  name: 'videoCall',
  initialState,
  reducers: {
    setCalling(state, action: PayloadAction<boolean>) {
      state.calling = action.payload;
    },

    setCallerVideoStream(state, action: PayloadAction<MediaStream>) {
      state.callerVideoStream = action.payload;
    },

    setCalleeVideoStream(state, action: PayloadAction<MediaStream>) {
      state.calleeVideoStream = action.payload;
    },

    setCallEnded(state, action: PayloadAction<boolean>) {
      state.callEnded = action.payload;
    },

    setCalleeId(state, action: PayloadAction<number>) {
      state.calleeId = action.payload;
    },

    setOpenCallVideo(state, action: PayloadAction<boolean>) {
      state.openCallVideo = action.payload;
    },

    setReceiveCall(state, action: PayloadAction<boolean>) {
      state.receiveCall = action.payload;
    },

    setCalleeName(state, action: PayloadAction<string>) {
      state.calleeName = action.payload;
    },

    setCalleeImgUrl(state, action: PayloadAction<string>) {
      state.calleeImgUrl = action.payload;
    },
  },
});

export const videoCallReducer = slice.reducer;
export const {
  setCallEnded,
  setCalleeId,
  setCalleeVideoStream,
  setCallerVideoStream,
  setCalling,
  setCalleeImgUrl,
  setCalleeName,
  setReceiveCall,
  setOpenCallVideo,
} = slice.actions;
