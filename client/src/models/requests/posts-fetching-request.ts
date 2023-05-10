import PageOptions from '../page-options';

export interface PostsFetchingRequest {
  readonly pageOptions: PageOptions;
  readonly section?: string;
}
