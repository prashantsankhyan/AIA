import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AllApiService } from '../../_service/all-api.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-list-of-all-data-of-renew',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule, SpinnerComponent],
  templateUrl: './list-of-all-data-of-renew.component.html',
  styleUrls: ['./list-of-all-data-of-renew.component.scss']
})
export class ListOfAllDataOfRenewComponent {
  showSpiner = true;
  listOfDriver: any[] = [];
  listOfVehicle: any[] = [];
  LossRunSummaray: any[] = [];
  AutoLiability: any[] = [];
  AutoPhysicalDamage: any[] = [];
  MoterTruckCargo: any[] = [];

  AccountID = '';
  MarkedPolicyID: any;
  ChildPolicyID: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: AllApiService,
    private router: ActivatedRoute,
    private cRouter: Router,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.AccountID = this.data.AccountID;
    this.ChildPolicyID = this.data.ChildPolicyID;
    this.MarkedPolicyID = this.data.MarkedPolicyID;

    this.getAllDriver();
    this.getAllVehicle();
    this.getAllAccountSummary();
  }

  getAllDriver() {
    this.http.getAllDataByTwoId(ApiUrl.getALLClaimDriver, this.MarkedPolicyID, this.ChildPolicyID).subscribe(data => {
      this.showSpiner = false;
      const obj = JSON.parse(JSON.stringify(data));
      this.listOfDriver = obj.Drivers.map((driver: any) => ({
        ...driver,
        Experience: this.calculateExperience(driver.YearofLicenceIssued)
      }));
    });
  }

  getAllVehicle() {
    this.http.getAllDataByTwoId(ApiUrl.getAllClaimVehicle, this.MarkedPolicyID, this.ChildPolicyID).subscribe(data => {
      this.showSpiner = false;
      const obj = JSON.parse(JSON.stringify(data));
      this.listOfVehicle = obj.Vehicles;
    });
  }

  getAllAccountSummary() {
    this.http.getAllDataId(ApiUrl.getAccountSummary, this.AccountID,)
      .subscribe(data => {
        this.showSpiner = false;
        const obj = JSON.parse(JSON.stringify(data));
        this.LossRunSummaray = obj.LossRunSummaray;
        this.AutoLiability = obj.AutoLiability;
        this.AutoPhysicalDamage = obj.AutoPhysicalDamage;
        this.MoterTruckCargo = obj.MoterTruckCargo;
      });
  }

  calculateExperience(issuedDate: string): string {
    if (!issuedDate) return 'N/A';
    const issued = new Date(issuedDate);
    const today = new Date();

    let years = today.getFullYear() - issued.getFullYear();
    let months = today.getMonth() - issued.getMonth();
    if (today.getDate() < issued.getDate()) months--;

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} Year${years !== 1 ? 's' : ''}, ${months} Month${months !== 1 ? 's' : ''}`;
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  exportToExcel(): void {
    const workbook = XLSX.utils.book_new();

    // Drivers
    const driverSheet = XLSX.utils.json_to_sheet(this.listOfDriver.map((d: any) => ({
      'Driver Name': d.DriverName,
      'Driver Licence No': d.DriverLicenceNo,
      'State Licenced': d.StateLicenced,
      'Year of Licence Issued': this.formatDate(d.YearofLicenceIssued),
      'Date of Birth': this.formatDate(d.DateofBirth),
      'Experience': d.Experience
    })));
    XLSX.utils.book_append_sheet(workbook, driverSheet, 'Driver Details');

    // Vehicles
    const vehicleSheet = XLSX.utils.json_to_sheet(this.listOfVehicle.map((v: any) => ({
      'Make': v.Make,
      'Model': v.Model,
      'Body Type': v.BodyType,
      'VIN': v.VIN,
      'Value': v.Value
    })));
    XLSX.utils.book_append_sheet(workbook, vehicleSheet, 'Vehicle Details');

    // Loss Run
    const lossRunSheet = XLSX.utils.json_to_sheet(this.LossRunSummaray.map((l: any) => ({
      'Term': l.Term,
      'TIV': l.TIV,
      'APD Deductible': l.APDDeductible,
      'MTC Deductible': l.MTCDeductible,
      'Auto Liability Deductible': l.AutoLiabilityDeductible,
      'Gross Revenue': l.GrossRevenue,
      'MTC Units at Bind': l.MTCDeduUnitsatBindctible,
      'Max Units': l.MaxNumberofUnits,
      'Units at Renewal': l.UnitsatRenewal,
      'Mileage': l.Mileage
    })));
    XLSX.utils.book_append_sheet(workbook, lossRunSheet, 'Loss Run');

    // Auto Liability
    const autoLiabilitySheet = XLSX.utils.json_to_sheet(this.AutoLiability.map((a: any) => ({
      'Carrier': a.Carrier,
      'Policy Number': a.PolicyNumber,
      'Policy Inception': this.formatDate(a.PolicyInception),
      'Policy Expiration': this.formatDate(a.PolicyExpiration),
      'Open Claims': a.OpenClaims,
      'Closed Claims': a.ClosedClaims,
      'Total Claims': a.TotalNoofClaims,
      'Reserve': a.Reserve,
      'Paid': a.Paid,
      'Total Incurred': a.TotalIncurred
    })));
    XLSX.utils.book_append_sheet(workbook, autoLiabilitySheet, 'Auto Liability');

    // Auto Physical Damage
    const autoPhysicalSheet = XLSX.utils.json_to_sheet(this.AutoPhysicalDamage.map((p: any) => ({
      'Carrier': p.Carrier,
      'Policy Number': p.PolicyNumber,
      'Policy Inception': this.formatDate(p.PolicyInception),
      'Policy Expiration': this.formatDate(p.PolicyExpiration),
      'Open Claims': p.OpenClaims,
      'Closed Claims': p.ClosedClaims,
      'Total Claims': p.TotalNoofClaims,
      'Reserve': p.Reserve,
      'Paid': p.Paid,
      'Total Incurred': p.TotalIncurred
    })));
    XLSX.utils.book_append_sheet(workbook, autoPhysicalSheet, 'Physical Damage');

    // Motor Truck Cargo
    const truckCargoSheet = XLSX.utils.json_to_sheet(this.MoterTruckCargo.map((m: any) => ({
      'Carrier': m.Carrier,
      'Policy Number': m.PolicyNumber,
      'Policy Inception': this.formatDate(m.PolicyInception),
      'Policy Expiration': this.formatDate(m.PolicyExpiration),
      'Open Claims': m.OpenClaims,
      'Closed Claims': m.ClosedClaims,
      'Total Claims': m.TotalNoofClaims,
      'Reserve': m.Reserve,
      'Paid': m.Paid,
      'Total Incurred': m.TotalIncurred
    })));
    XLSX.utils.book_append_sheet(workbook, truckCargoSheet, 'Truck Cargo');

    // Save Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(blob, 'ClientSummary.xlsx');
  }
}
