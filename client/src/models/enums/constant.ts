export enum Constant {
  TokenKey = 'token',
  AuthHeader = 'Authorization',
  AuthPrefix = 'Bearer',
  AuthEndpoint = 'auth',
  UserEndpoint = 'user',
  SectionEndpoint = 'section',
  PostEndPoint = 'post',
  UploadEndPoint = 'upload',
  NotificationEndPoint = 'notification',
  PostScrollAreaId = '#post-scroll-area-id',
  CommentScrollAreaId = '#comment-scroll-area-id',
  CommentEndPoint = 'comment',
  CommentState = 'commentState',
  PageSize = 15,
  DebounceTimeInMiliSeconds = 700,
}

export enum MediaType {
  Video = 'video',
  Image = 'image',
  Gif = 'gif',
}

export enum ComputedConstants {
  ScreenHeight = window.innerHeight,
  ScreenWidth = window.innerWidth,
}
