import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../sharingModule/material/material.module';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../../_core/apiUrl';
import { catchError, throwError, timeout, forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-edit-vehcile-support',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule, ReactiveFormsModule],
  templateUrl: './add-edit-vehcile-support.component.html',
  styleUrl: './add-edit-vehcile-support.component.scss'
})
export class AddEditVehcileSupportComponent {
saveOneClick = true
  showSpiner = true;
  addEditVehicleForm!: FormGroup;
  submit = false;
  accountId = '';
  VehicleID: any;
  alertMessage = '';
  errorMessage = '';
  messageSuccess = true;
  userName: any;
  listOfPolicy: any[] = [];
  listOfEditVehicle: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: AllApiService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<AddEditVehcileSupportComponent>
  ) {}

  ngOnInit(): void {
    this.VehicleID = this.data?.VehicleID;
    this.userName = sessionStorage.getItem('UserName');
    this.accountId = JSON.parse(localStorage.getItem('accountId') || '{}');

    if (!this.userName) {
      this.router.navigate(['/login']);
      this.dialogRef.close();
      return;
    }

    this.makeForm();

    // Load policies and vehicle data together
    if (this.VehicleID) {
      this.loadEditData();
    } else {
      this.loadPoliciesOnly();
      // set today's date in ADD mode
      const today = new Date().toISOString().split('T')[0];
      this.addEditVehicleForm.patchValue({ EnterDate: today });
    }
  }

  /** Build Form */
  makeForm() {
    this.addEditVehicleForm = this.fb.group({
      VehicleID: [0],
      Unit:['',Validators.required],
      AccountID: [this.accountId, Validators.required],
      Year: ['', Validators.required],
      Make: ['', Validators.required],
      Model: ['', Validators.required],
      VIN: ['', Validators.required],
      Value: ['', Validators.required],
      BodyType: ['', Validators.required],
      PolicyNumber: [null, Validators.required],
      Option: ['', Validators.required],
      EnterDate: ['', Validators.required], // YYYY-MM-DD for date input
      EnterBy: [this.userName],
      Description:[''],
      UpdatedBy: ['']
    });
  }

  /** Load only policies for add mode */
  loadPoliciesOnly() {
    this.http.getAllDataId(ApiUrl.getAllPolicyByAccountId, this.accountId)
      .subscribe(data => {
        this.showSpiner = false;
        const obj = data as any;
        this.listOfPolicy = obj.ChildPolicys || [];
      });
  }

  


  /** Load policies and vehicle details in parallel for edit */
  loadEditData() {
    forkJoin({
      policies: this.http.getAllDataId(ApiUrl.getAllPolicyByAccountId, this.accountId),
      vehicle: this.http.getAllDataId(ApiUrl.getByIdReportAndSupport, this.VehicleID)
    }).subscribe(({ policies, vehicle }) => {
      this.showSpiner = false;

      // Policies
      const policyObj = policies as any;
      this.listOfPolicy = policyObj.ChildPolicys || [];

      // Vehicle
      const vData = vehicle as any;
      const vehicleDetails = vData?.Vehicles?.[0];

      if (vehicleDetails) {
        this.addEditVehicleForm.patchValue({
         
          VehicleID: vehicleDetails.VehicleID,
          AccountID: vehicleDetails.AccountID,
           Unit:vehicleDetails.Unit,
          Year: vehicleDetails.Year,
          Make: vehicleDetails.Make,
          Model: vehicleDetails.Model,
          BodyType:vehicleDetails.BodyType,
          VIN: vehicleDetails.VIN,
          Value: vehicleDetails.Value,
          Option: vehicleDetails.Option,
          PolicyNumber: vehicleDetails.PolicyNumber,
          EnterBy:this.userName,
           Description: vehicleDetails.Description,
          EnterDate: new Date(vehicleDetails.EnterDate).toISOString().split('T')[0] // ✅ for <input type="date">
        });
      }
    });
  }

  /** Optional: Format to MM/dd/yyyy for display or API if needed */
  formatMMDDYYYY(dateString: string): string {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  /** Handle Submit */
  onSubmit() {
    this.submit = true;
    this.messageSuccess = false;
    this.saveOneClick = false;

    if (this.addEditVehicleForm.invalid) {
      this.messageSuccess = true;
      this.saveOneClick = true;
      return;
    }

    const obj = { ...this.addEditVehicleForm.value };

    if (this.VehicleID) {
      obj.VehicleID = this.VehicleID;
    }

    // If API expects MM/dd/yyyy:
    // obj.EnterDate = this.formatMMDDYYYY(obj.EnterDate);

    this.http.addEditData(ApiUrl.supportOrReportTeamVehicle, obj)
      .pipe(
        timeout(60000),
        catchError(error => {
          this.errorMessage = error.name === 'TimeoutError'
            ? 'The request timed out. Please check your internet connection.'
            : 'An unexpected error occurred. Please try again later.';
          this.error();
          return throwError(error);
        })
      )
      .subscribe(resp => {
        const result = resp as any;
          this.alertMessage = result?.Data?.ErrorMessage
        if (result?.Data?.Response =='1') {
       
          this.showSuccess();

        } else {
          this.error();
        }
      });
  }

  /** Success Handler */
  showSuccess() {
    this.cancleModel();
    this.toastr.success(this.alertMessage, '', { timeOut: 3000 });
    this.messageSuccess = true;
    this.changeLocation();
  }

  /** Error Handler */
  error() {
    this.toastr.error(this.errorMessage, '', { timeOut: 3000 });
    this.cancleModel();
  }

  /** Close Modal */
  cancleModel(): void {
    this.dialogRef.close();
    this.changeLocation();
  }

  /** Reload page */
  changeLocation() {
    let currentRoute = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([currentRoute]));
  }

  /** Getter for form controls */
  get f() {
    return this.addEditVehicleForm.controls;
  }
}
