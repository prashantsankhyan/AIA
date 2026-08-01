import { CanDeactivateFn } from '@angular/router';

export const canDeativeGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  return true;
};
