export interface IApiService {
  path: string;
  body?: any;
  query?: any;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  needCache?: boolean;
  hostApi?: string;
  headerType?: 'FILE' | 'JSON' | 'NORMAL';

  paging?: {
    token?: string;
    search?: string;
    perPage?: number;
  }
};