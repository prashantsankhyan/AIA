import { TestBed } from '@angular/core/testing';

import { SaveLoginUserService } from './save-login-user.service';

describe('SaveLoginUserService', () => {
  let service: SaveLoginUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveLoginUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
