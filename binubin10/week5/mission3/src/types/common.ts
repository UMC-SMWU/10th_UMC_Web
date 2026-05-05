import type { ReactNode } from 'react';

export type CommonRespone<T> = {
  refreshToken: any;
  accessToken: any;
  result: import('./auth').ResponseSigninDto;
  name: ReactNode;
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
};
