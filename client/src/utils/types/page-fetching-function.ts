import Page from '../../models/page';
import { PageFetchingRequest } from '../../models/requests/page-fetching-request';

export type PageFetchingFunction<RequestType extends PageFetchingRequest, ContentType> = (
  request: RequestType,
) => Promise<Page<ContentType>>;
