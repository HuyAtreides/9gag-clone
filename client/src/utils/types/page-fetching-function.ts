import { PageFetchingRequest } from '../../models/requests/page-fetching-request';
import Slice from '../../models/slice';

export type PageFetchingFunction<RequestType extends PageFetchingRequest, ContentType> = (
  request: RequestType,
) => Promise<Slice<ContentType>>;
