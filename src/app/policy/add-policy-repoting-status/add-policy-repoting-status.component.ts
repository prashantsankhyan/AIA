import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet
} from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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

  showSpiner = true;

  updateForm!: FormGroup;

  submit = false;

  accountId: any = '';
  ChildPolicyID: any;

  alertMessage = '';
  errorMessage = '';

  messageSuccess = true;
  dataResponse: any;

  userName: any;

  // IMPORTANT
  // 0 = INSERT
  // > 0 = UPDATE
  RepostingID: number = 0;

  listOfData: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: AllApiService,
    private toastr: ToastrService,
    private cRouter: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddPolicyRepotingStatusComponent>
  ) {}

  ngOnInit(): void {

    this.userName = sessionStorage.getItem('UserName');

    this.accountId =
      JSON.parse(localStorage.getItem('accountId') || 'null');

    this.ChildPolicyID = this.data.ChildPolicyID;

    console.log('ChildPolicyID:', this.ChildPolicyID);
    console.log('AccountId:', this.accountId);

    this.makeForm();

    this.getData();
  }


  // ============================================================
  // FORM
  // ============================================================

  makeForm() {

    this.updateForm = this.fb.group({

      RepostingID: [0],

      AccountId: [
        this.accountId,
        Validators.required
      ],

      ChildPolicyId: [
        this.ChildPolicyID,
        Validators.required
      ],

      RepostingType: [
        '',
        Validators.required
      ],

      EnteredBy: [
        this.userName
      ]

    });
  }


  // ============================================================
  // GET EXISTING POLICY REPORTING STATUS
  // ============================================================

getData() {

  this.showSpiner = true;

  this.http
    .getAllDataId(
      ApiUrl.getPolicyStatus,
      this.ChildPolicyID
    )
    .subscribe({

      next: (data: any) => {

        const obj =
          typeof data === 'string'
            ? JSON.parse(data)
            : data;

        console.log('POLICY STATUS RESPONSE:', obj);

        // =====================================================
        // EXISTING RECORD
        // =====================================================

        if (
          obj &&
          obj.Response != 0 &&
          Array.isArray(obj.Reposting) &&
          obj.Reposting.length > 0
        ) {

          const existingData = obj.Reposting[0];

          // VERY IMPORTANT
          this.RepostingID =
            Number(existingData.RepostingID);

          console.log('EXISTING RECORD FOUND');
          console.log('RepostingID:', this.RepostingID);
          console.log('Existing RepostingType:', existingData.RepostingType);

          this.updateForm.patchValue({

            RepostingID:
              this.RepostingID,

            AccountId:
              this.accountId,

            ChildPolicyId:
              this.ChildPolicyID,

            RepostingType:
              existingData.RepostingType,

            EnteredBy:
              this.userName

          });

          console.log(
            'UPDATE MODE:',
            this.updateForm.value
          );

        }

        // =====================================================
        // NO RECORD
        // =====================================================

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

          console.log('INSERT MODE');
        }

        this.showSpiner = false;

      },

      error: (error) => {

        console.error(
          'Get Policy Status Error:',
          error
        );

        this.RepostingID = 0;
        this.showSpiner = false;

      }

    });
}


  // ============================================================
  // SAVE / UPDATE
  // ============================================================

onSubmit() {

  this.submit = true;

  if (this.updateForm.invalid) {
    this.updateForm.markAllAsTouched();
    return;
  }

  const obj: any = {

    RepostingID:
      Number(this.RepostingID) || 0,

    AccountId:
      this.accountId,

    ChildPolicyId:
      this.ChildPolicyID,

    RepostingType:
      this.updateForm.get('RepostingType')?.value,

    EnteredBy:
      this.userName

  };

  console.log('================================');
  console.log(
    this.RepostingID > 0
      ? 'UPDATE'
      : 'INSERT'
  );
  console.log('RepostingID:', this.RepostingID);
  console.log('Request:', obj);
  console.log('================================');


  this.http
    .addEditData(
      ApiUrl.addPolicyStatus,
      obj
    )
    .subscribe({

      next: (data: any) => {

        console.log('API SAVE RESPONSE:', data);

        const result =
          typeof data === 'string'
            ? JSON.parse(data)
            : data;

        this.dataResponse =
          result?.Data?.Response;

        if (this.dataResponse == '0') {

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

        this.alertMessage =
          result?.Data?.ErrorMessage ||
          'Record saved successfully.';

        this.toastr.success(
          this.alertMessage,
          '',
          {
            timeOut: 3000
          }
        );

        this.closeModel();

      },

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
  // CLOSE
  // ============================================================

  closeModel(): void {

    this.dialogRef.close();

    this.http.filter(
      '5555555555555555555555555555555555555'
    );
  }

}