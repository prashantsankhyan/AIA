import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const loginRedirectGuardGuard: CanActivateFn = (route, state) => {
 const router = inject(Router);

  const loggendUser = localStorage.getItem('TeamType')
   if (loggendUser) {
      // User already logged in, redirect to home/dashboard
      router.navigate(['/alertLogin']); // or whatever your main route is
      return false;
    }
    return true; // Allow access to login page if not logged in
};
