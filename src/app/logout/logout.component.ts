import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AllApiService } from '../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../_core/apiUrl';
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule, ReactiveFormsModule],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  showSpinner = false; // Spinner visibility flag
  confirmLogin!: FormGroup;
  submit = false;
  messageSuccess = true;

  constructor(
    private fb: FormBuilder,
    private http: AllApiService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.makeForm();
  }

  makeForm() {
    this.confirmLogin = this.fb.group({
      userName: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submit = true;
    this.messageSuccess = false;

    if (!this.confirmLogin.valid) {
      this.toastr.error('Please fill in all required fields.');
      return;
    }

    const userCredentials = this.confirmLogin.value;

    this.showSpinner = true; // Show spinner during the API request
    this.http.addEditData(ApiUrl.deleteExistLoginByLogout, userCredentials)
      .pipe(
        timeout(25000),
        catchError(error => {
          this.showSpinner = false;
          if (error.name === 'TimeoutError') {
            alert('Internet is slow, please wait or check your connection.');
          } else {
            this.toastr.error('Something went wrong, please try again.', '', { timeOut: 3000 });
          }
          return throwError(() => error);
        })
      )
      .subscribe(data => {
        this.showSpinner = false; // Hide spinner after response

        const responseObj = JSON.parse(JSON.stringify(data));
       console.log('responseObj',responseObj.Data.Response)
        if (responseObj.Data.Response === 1) {
          this.clearLocalStorage();
          
          this.toastr.success('Logout successful', '', { timeOut: 3000 });
          
        } else {
          this.toastr.error('You may logout it .', '', { timeOut: 3000 });
        }
      });
  }

  get f() {
    return this.confirmLogin.controls;
  }

  clearLocalStorage() {
    const keysToRemove = [
      'teamName', 'accountId', 'accountName', 'MarkedPolicyID', 
      'ChildPolicyID', 'EndorsementID', 'IsChildPolicyExist', 'lookUpCode',
      'emailID', 'phoneNumber', 'Password', 'UserName', 'TeamType',
      'marketedName', 'Yard_Address', 'No_of_Driver', 'No_of_Unit', 
      'PolicyType'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}
