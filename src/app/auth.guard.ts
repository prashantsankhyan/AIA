import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
 
  
  const router = inject(Router);

  const loggendUser = localStorage.getItem('TeamType')
  if(loggendUser != null){
    return true;
  }else{
  router.navigateByUrl('login')
  return false;
  }
};

// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);

 
//   const loggedInUser = localStorage.getItem('UserName');
//   if (!loggedInUser) {
    
//     router.navigateByUrl('login');
//     return false;
//   }

 
//   if (!sessionStorage.getItem('navigated')) {
    
//     alert('Direct access to this page is not allowed. Please navigate through the application.');

   
//     return false;
//   }


//   sessionStorage.removeItem('navigated');
//   return true;
// };
