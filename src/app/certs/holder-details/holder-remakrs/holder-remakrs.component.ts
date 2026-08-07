import { CommonModule, formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { MaterialModule } from '../../../sharingModule/material/material.module';
import { AllApiService } from '../../../_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-holder-remakrs',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbAlertModule
  ],
  templateUrl: './holder-remakrs.component.html',
  styleUrl: './holder-remakrs.component.scss'
})
export class HolderRemakrsComponent {

  holderRemarksForm!: FormGroup;

  submit = false;
  showButton = true;
  messageSuccess = true;

  alertMessage = '';
  errorMessage = '';
  dataResponse: any;

  AccountID: any;
  HolderRemarkID: any;
  LoginUserName: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: AllApiService,
    private router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<HolderRemakrsComponent>
  ) {}

  ngOnInit(): void {
    this.AccountID = JSON.parse(localStorage.getItem('accountId') || '{}');
    this.LoginUserName = sessionStorage.getItem('UserName');

    this.makeForm();
 
  }

  makeForm() {
   
    this.holderRemarksForm = this.fb.group({
      
      AccountID: [this.AccountID, Validators.required],
      Description: ['', Validators.required],
     
      EnteredBy: [this.LoginUserName]
    });
  }



  onSubmit() {

    this.submit = true;

    if (this.holderRemarksForm.invalid) {
      return;
    }

    const obj = { ...this.holderRemarksForm.value };

    this.http.addEditData(ApiUrl.addHolderRemakrs, obj)
      .subscribe((data: any) => {

        this.dataResponse = data.Data.Response;

        if (this.dataResponse === '0') {
          this.toastr.error(data.Data.ErrorMessage);
        } else {
          this.toastr.success(data.Data.ErrorMessage);
          this.dialogRef.close(true);
        }

      });
  }

  get f() {
    return this.holderRemarksForm.controls;
  }

  onNoClick() {
    this.dialogRef.close();
  }
}