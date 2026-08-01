import { TestBed } from '@angular/core/testing';

import { CloseWindowService } from './close-window.service';

describe('CloseWindowService', () => {
  let service: CloseWindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloseWindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
