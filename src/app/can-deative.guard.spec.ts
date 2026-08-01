import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { canDeativeGuard } from './can-deative.guard';

describe('canDeativeGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => canDeativeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
