import { timer, throwError, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export interface RetryParams {
  maxAttempts?: number;
  waitTime?: number;
  shouldRetry?: (status: Status) => boolean;
}

const defaultParams: RetryParams = {
  maxAttempts: 3,
  waitTime: 100,
  shouldRetry: (status: Status) => status.status >= 500,
};

interface Status {
  status: number;
}

export const genericRetryStrategy = (params: RetryParams = {}) => (attempts: Observable<any>) =>
  attempts.pipe(
    mergeMap((error: any, i: number) => {
      const { maxAttempts, waitTime, shouldRetry } = { ...defaultParams, ...params };
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (retryAttempt > maxAttempts || !shouldRetry(error)) {
        return throwError(error);
      }
      // retry after 1s, 2s, etc...
      return timer(waitTime);
    })
  );
