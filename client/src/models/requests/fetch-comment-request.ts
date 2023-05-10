import PageOptions from '../page-options';

export interface FetchCommentRequest {
  readonly pageOptions: PageOptions;
  readonly priorityIds?: number[];
}
