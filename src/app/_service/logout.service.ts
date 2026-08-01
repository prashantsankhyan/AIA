import { HostListener, Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { AllApiService } from '../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../_core/apiUrl';
import { catchError, throwError, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(
    private http: AllApiService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  performLogout0(userData: any){

  }
   @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    $event.preventDefault();
  }

  performLogout(userData: any) {
   
   
 
    return this.http.addEditData(ApiUrl.deleteExistLoginByLogout, userData)
      .pipe(
        timeout(25000),
        catchError(error => {
          if (error.name === 'TimeoutError') {
            alert('Internet is slow, please wait or check your connection.');
          } else {
            this.toastr.error('Something went wrong, please try again.', '', { timeOut: 3000 });
          }
          return throwError(() => error);
        })
      ).subscribe(data => {
        if (data?.Data?.Response === 1) {
         
          this.clearLocalStorage();
          this.toastr.success('Logout successfully', '', { timeOut: 3000 });
          localStorage.removeItem('TeamType');
          this.router.navigate(['/login']);
         
        
   
        } else {
          this.router.navigate(['/login']);
          this.toastr.error('Please check Login Filed', '', { timeOut: 3000 });
        }
      });
  }

   clearLocalStorage() {
    sessionStorage.clear(); // Clear all stored items
  
    console.log('Logout event triggered'); // Debug log
  }
}
