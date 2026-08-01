import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { AllApiService } from '../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../_core/apiUrl';
import { catchError, throwError, timeout } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SaveLoginUserService {
  constructor(
    private http: AllApiService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  perform(userData: any) {
    
    return this.http.addEditData(ApiUrl.addUserInExistForm, userData)
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
          
          this.toastr.success(data?.Data?.ErrorMessage, '', { timeOut: 3000 });
          this.router.navigate(['/dashboard'])
        } else {
        
          this.toastr.error('User already exists ', '', { timeOut: 3000 });
        }
      });
  }

 
}
