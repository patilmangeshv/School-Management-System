import { TestBed } from '@angular/core/testing';

import { BusyHttpService } from './busy-http.service';

describe('BusyHttpService', () => {
  let service: BusyHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusyHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
