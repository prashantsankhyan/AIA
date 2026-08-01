import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginPageGardGuard } from './login-page-gard.guard';

describe('loginPageGardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginPageGardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
