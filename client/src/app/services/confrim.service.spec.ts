import { TestBed } from '@angular/core/testing';

import { ConfrimService } from './confrim.service';

describe('ConfrimService', () => {
  let service: ConfrimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfrimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
