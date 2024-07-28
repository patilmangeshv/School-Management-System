import { TestBed } from '@angular/core/testing';

import { AddEventPhotosService } from './add-event-photos.service';

describe('AddEventPhotosService', () => {
  let service: AddEventPhotosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddEventPhotosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
