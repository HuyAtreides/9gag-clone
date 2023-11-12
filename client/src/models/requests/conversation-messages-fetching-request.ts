import { PageFetchingRequest } from './page-fetching-request';

export interface ConversationMessagesFetchingRequest extends PageFetchingRequest {
  readonly conversationId: number;
}
