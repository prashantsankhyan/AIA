import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import { MaterialModule } from '../../sharingModule/material/material.module';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  NgbAlertModule,
  NgbDatepickerModule
} from '@ng-bootstrap/ng-bootstrap';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';

import { AllApiService } from '../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../_core/apiUrl';


@Component({
  selector: 'app-add-policy-repoting-status',

  standalone: true,

  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbDatepickerModule,
    NgbAlertModule
  ],

  templateUrl: './add-policy-repoting-status.component.html',

  styleUrl: './add-policy-repoting-status.component.scss'
})
export class AddPolicyRepotingStatusComponent {


  // ============================================================
  // LOADING
  // ============================================================

  showSpiner = true;


  // ============================================================
  // FORM
  // ============================================================

  updateForm!: FormGroup;

  submit = false;


  // ============================================================
  // POLICY INFORMATION
  // ============================================================

  accountId: any = '';

  ChildPolicyID: any;


  // ============================================================
  // RESPONSE / MESSAGE
  // ============================================================

  alertMessage = '';

  errorMessage = '';

  messageSuccess = true;

  dataResponse: any;


  // ============================================================
  // USER
  // ============================================================

  userName: any;


  // ============================================================
  // RECORD ID
  //
  // 0     = INSERT
  // > 0   = UPDATE
  // ============================================================

  RepostingID: number = 0;


  // ============================================================
  // DATA
  // ============================================================

  listOfData: any[] = [];


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(

    @Inject(MAT_DIALOG_DATA)
    public data: any,

    private fb: FormBuilder,

    private http: AllApiService,

    private toastr: ToastrService,

    private cRouter: ActivatedRoute,

    private router: Router,

    public dialog: MatDialog,

    public dialogRef:
      MatDialogRef<AddPolicyRepotingStatusComponent>

  ) {}


  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {

    // Get logged-in user

    this.userName =
      sessionStorage.getItem('UserName');


    // Get Account ID

    this.accountId =
      JSON.parse(
        localStorage.getItem('accountId') || 'null'
      );


    // Get Child Policy ID

    this.ChildPolicyID =
      this.data?.ChildPolicyID;


    console.log(
      'ChildPolicyID:',
      this.ChildPolicyID
    );

    console.log(
      'AccountId:',
      this.accountId
    );


    // Create form

    this.makeForm();


    // Get existing record

    this.getData();

  }


  // ============================================================
  // FORM
  // ============================================================

  makeForm(): void {

    this.updateForm =
      this.fb.group({

        // Existing record ID
        RepostingID: [
          0
        ],


        // Account
        AccountId: [
          this.accountId,
          Validators.required
        ],


        // Child Policy
        ChildPolicyId: [
          this.ChildPolicyID,
          Validators.required
        ],


        // Reporting Type
        RepostingType: [
          '',
          Validators.required
        ],


        // User
        EnteredBy: [
          this.userName
        ]

      });

  }


  // ============================================================
  // GET EXISTING POLICY REPORTING STATUS
  // ============================================================

  getData(): void {

    this.showSpiner = true;


    this.http
      .getAllDataId(
        ApiUrl.getPolicyStatus,
        this.ChildPolicyID
      )
      .subscribe({

        // ======================================================
        // SUCCESS
        // ======================================================

        next: (data: any) => {

          try {

            const obj =
              typeof data === 'string'
                ? JSON.parse(data)
                : data;


            console.log(
              'POLICY STATUS RESPONSE:',
              obj
            );


            // ==================================================
            // EXISTING RECORD
            // ==================================================

            if (

              obj &&

              obj.Response != 0 &&

              Array.isArray(obj.Reposting) &&

              obj.Reposting.length > 0

            ) {

              const existingData =
                obj.Reposting[0];


              // Get existing ID

              this.RepostingID =
                Number(
                  existingData.RepostingID
                ) || 0;


              console.log(
                'EXISTING RECORD FOUND'
              );

              console.log(
                'RepostingID:',
                this.RepostingID
              );

              console.log(
                'Existing RepostingType:',
                existingData.RepostingType
              );


              // ==============================================
              // PATCH EXISTING DATA
              // ==============================================

              this.updateForm.patchValue({

                RepostingID:
                  this.RepostingID,

                AccountId:
                  this.accountId,

                ChildPolicyId:
                  this.ChildPolicyID,

                RepostingType:
                  existingData.RepostingType || '',

                EnteredBy:
                  this.userName

              });


              console.log(
                'UPDATE MODE:',
                this.updateForm.value
              );

            }


            // ==================================================
            // NO RECORD
            // ==================================================

            else {

              this.RepostingID = 0;


              this.updateForm.patchValue({

                RepostingID: 0,

                AccountId:
                  this.accountId,

                ChildPolicyId:
                  this.ChildPolicyID,

                RepostingType: '',

                EnteredBy:
                  this.userName

              });


              console.log(
                'INSERT MODE'
              );

            }


          }

          catch (error) {

            console.error(
              'Policy Status Parse Error:',
              error
            );


            this.RepostingID = 0;

          }


          finally {

            this.showSpiner = false;

          }

        },


        // ======================================================
        // ERROR
        // ======================================================

        error: (error) => {

          console.error(
            'Get Policy Status Error:',
            error
          );


          this.RepostingID = 0;


          this.showSpiner = false;


          this.toastr.error(
            'Unable to load policy reporting status.',
            '',
            {
              timeOut: 3000
            }
          );

        }

      });

  }


  // ============================================================
  // SAVE / UPDATE
  // ============================================================

  onSubmit(): void {

    this.submit = true;


    // ==========================================================
    // VALIDATION
    // ==========================================================

    if (this.updateForm.invalid) {

      this.updateForm.markAllAsTouched();

      return;

    }


    // ==========================================================
    // GET REPORTING TYPE
    // ==========================================================

    const reportingType =
      this.updateForm
        .get('RepostingType')
        ?.value;


    // ==========================================================
    // REQUEST OBJECT
    // ==========================================================

    const obj: any = {

      RepostingID:
        Number(
          this.RepostingID
        ) || 0,

      AccountId:
        this.accountId,

      ChildPolicyId:
        this.ChildPolicyID,

      RepostingType:
        reportingType,

      EnteredBy:
        this.userName

    };


    // ==========================================================
    // LOG
    // ==========================================================

    console.log(
      '================================'
    );

    console.log(
      this.RepostingID > 0
        ? 'UPDATE POLICY REPORTING STATUS'
        : 'INSERT POLICY REPORTING STATUS'
    );

    console.log(
      'RepostingID:',
      this.RepostingID
    );

    console.log(
      'RepostingType:',
      reportingType
    );

    console.log(
      'Request:',
      obj
    );

    console.log(
      '================================'
    );


    // ==========================================================
    // API
    // ==========================================================

    this.http
      .addEditData(
        ApiUrl.addPolicyStatus,
        obj
      )
      .subscribe({

        // ======================================================
        // SUCCESS
        // ======================================================

        next: (data: any) => {

          console.log(
            'API SAVE RESPONSE:',
            data
          );


          let result: any;


          try {

            result =
              typeof data === 'string'
                ? JSON.parse(data)
                : data;

          }

          catch (error) {

            console.error(
              'Save Response Parse Error:',
              error
            );


            this.toastr.error(
              'Invalid response received from server.',
              '',
              {
                timeOut: 3000
              }
            );

            return;

          }


          // ==================================================
          // API RESPONSE
          // ==================================================

          this.dataResponse =
            result?.Data?.Response;


          // ==================================================
          // ERROR
          // ==================================================

          if (
            this.dataResponse == '0'
          ) {

            this.errorMessage =
              result?.Data?.ErrorMessage ||
              'Unable to save record.';


            this.toastr.error(
              this.errorMessage,
              '',
              {
                timeOut: 3000
              }
            );


            return;

          }


          // ==================================================
          // SUCCESS
          // ==================================================

          this.alertMessage =
            result?.Data?.ErrorMessage ||
            (
              this.RepostingID > 0
                ? 'Reporting status updated successfully.'
                : 'Reporting status saved successfully.'
            );


          this.toastr.success(
            this.alertMessage,
            '',
            {
              timeOut: 3000
            }
          );


          // Close dialog

          this.closeModel();

        },


        // ======================================================
        // API ERROR
        // ======================================================

        error: (error) => {

          console.error(
            'Save API Error:',
            error
          );


          this.toastr.error(
            'Something went wrong while saving.',
            '',
            {
              timeOut: 3000
            }
          );

        }

      });

  }


  // ============================================================
  // FORM CONTROLS
  // ============================================================

  get f() {

    return this.updateForm.controls;

  }


  // ============================================================
  // CLOSE DIALOG
  // ============================================================

  closeModel(): void {

    this.dialogRef.close();


    // Refresh parent/list

    this.http.filter(
      '5555555555555555555555555555555555555'
    );

  }

}