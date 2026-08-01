import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const loginPageGardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);  // Inject ToastrService
  const loggedInUser = localStorage.getItem('TeamType');

  if (loggedInUser) {
    // If 'TeamType' exists in localStorage, show an error message
    toastr.error('Please log out first to access the login page again.', '', {
      timeOut: 3000,
    });

    // Redirect to the home page (or any other page you prefer)
     // Or '/dashboard', depending on your routing setup
     router.navigateByUrl('/loginAlert');
    return false;  // Prevent navigation to the login page
  }

  // Allow navigation to login page if 'TeamType' doesn't exist
  return true;
};
