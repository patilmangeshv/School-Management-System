import { TestBed } from '@angular/core/testing';

import { LoadingHttpInterceptor } from './loading-http.interceptor';

describe('LoadingHttpInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LoadingHttpInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: LoadingHttpInterceptor = TestBed.inject(LoadingHttpInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
