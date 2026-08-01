import { ChangeDetectorRef, Component } from '@angular/core';
import { AllApiService } from '../../_service/all-api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';
import * as XLSX from 'xlsx'; 
import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../spinner/spinner.component';


@Component({
  selector: 'app-endrosement-working-data',
  standalone: true,
  imports: [CommonModule, MaterialModule, SpinnerComponent],
  templateUrl: './endrosement-working-data.component.html',
  styleUrl: './endrosement-working-data.component.scss'
})
export class EndrosementWorkingDataComponent {
 showSpiner = true;
  AccountID: any;
  vehicles: any[] = [];
  drivers: any[] = [];
  filteredVehicles: any[] = [];  // Vehicles filtered by search
  filteredDrivers: any[] = [];   // Drivers filtered by search

  dataType: 'Vehicle' | 'Driver' = 'Vehicle'; // Default view

  ClaimID: any;
  confirmReason: any;

  // Vehicle search criteria
  searchCriteria = {
    VIN: '',
    Year: '',
    Model: '',
    AccountName: '',
  };

  // Driver search criteria
  searchCriteriaDriver = {
    DriverName: '',
    DateofBirth: '',
    DriverLicenceNo: '',
    AccountName: '',
    LookUpcode: ''
  };

  exportCount: number | null = null;  // For limiting export rows

  constructor(
    private http: AllApiService,
    private cRouter: Router,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.AccountID = JSON.parse(localStorage.getItem('accountId') || '{}');
    this.getAllVehicle();
    this.getAllDriver();
    localStorage.removeItem('confirmReason');
  }

  // Switch to Vehicle view and reset export count
  showVehicles() {
    this.dataType = 'Vehicle';
    this.exportCount = null;
  }

  // Switch to Driver view and reset export count
  showDrivers() {
    this.dataType = 'Driver';
    this.exportCount = null;
  }

  // Fetch vehicles and initialize filtered vehicle list
  getAllVehicle() {
    this.http.getAllData(ApiUrl.allVehicleByEndrosment).subscribe(data => {
      let obj = JSON.parse(JSON.stringify(data));
      this.vehicles = obj.Vehicles || [];
      this.filteredVehicles = this.vehicles;
      this.showSpiner = false;
    });
  }

  // Fetch drivers and initialize filtered driver list
  getAllDriver() {
    this.http.getAllData(ApiUrl.allDriverByEndrosment).subscribe(data => {
      let obj = JSON.parse(JSON.stringify(data));
      this.drivers = obj.Drivers || [];
      this.filteredDrivers = this.drivers;
      this.showSpiner = false;
    });
  }

  // Filter vehicles based on criteria (VIN, Year EXACT match, Model, AccountName)
  filterVehicles() {
    const yearFilter = this.searchCriteria.Year.trim();
    const filterYear = Number(yearFilter);
    const isYearValid = !isNaN(filterYear) && Number.isInteger(filterYear);

    this.filteredVehicles = this.vehicles.filter(v => {
      const matchesYear = !yearFilter || (isYearValid && v.Year === filterYear);

      return (
        (!this.searchCriteria.VIN || (v.VIN?.toLowerCase().includes(this.searchCriteria.VIN.toLowerCase()))) &&
        matchesYear &&
        (!this.searchCriteria.Model || (v.Model?.toLowerCase().includes(this.searchCriteria.Model.toLowerCase()))) &&
        (!this.searchCriteria.AccountName || (v.AccountName?.toLowerCase().includes(this.searchCriteria.AccountName.toLowerCase())))
      );
    });
  }

  // Filter drivers based on DriverName, DateofBirth substring formatted MM/DD/YYYY, DriverLicenceNo, AccountName, LookUpcode
  filterDrivers() {
    const dobFilter = this.searchCriteriaDriver.DateofBirth.trim().toLowerCase();

    this.filteredDrivers = this.drivers.filter(driver => {
      // Format DateofBirth as MM/DD/YYYY string for substring matching
      let dobString = '';
      if (driver.DateofBirth) {
        const dob = new Date(driver.DateofBirth);
        const month = (dob.getMonth() + 1).toString().padStart(2, '0');
        const day = dob.getDate().toString().padStart(2, '0');
        const year = dob.getFullYear();
        dobString = `${month}/${day}/${year}`.toLowerCase();
      }

      const matchDOB = !dobFilter || dobString.includes(dobFilter);

      return (
        (!this.searchCriteriaDriver.DriverName || (driver.DriverName?.toLowerCase().includes(this.searchCriteriaDriver.DriverName.toLowerCase()))) &&
        (!this.searchCriteriaDriver.DriverLicenceNo || (driver.DriverLicenceNo?.toLowerCase().includes(this.searchCriteriaDriver.DriverLicenceNo.toLowerCase()))) &&
        (!this.searchCriteriaDriver.AccountName || (driver.AccountName?.toLowerCase().includes(this.searchCriteriaDriver.AccountName.toLowerCase()))) &&
        (!this.searchCriteriaDriver.LookUpcode || (driver.LookUpcode?.toLowerCase().includes(this.searchCriteriaDriver.LookUpcode.toLowerCase()))) &&
        matchDOB
      );
    });
  }

  /**
   * Export filtered data to Excel.
   * @param type - 'Vehicle' or 'Driver'
   * @param rowCount - optional number of rows to export, exports all if not specified or invalid
   */
  exportToExcel(type: 'Vehicle' | 'Driver', rowCount?: number) {
    let dataArray = type === 'Vehicle' ? this.filteredVehicles : this.filteredDrivers;
    const maxRows = dataArray.length;

    // Sanitize and normalize rowCount parameter
    let count = typeof rowCount === 'number' && rowCount > 0 && rowCount <= maxRows ? rowCount : maxRows;

    let dataToExport: any[] = [];
    let filename = '';

    if (type === 'Vehicle') {
      dataToExport = dataArray.slice(0, count).map(vehicle => ({
        Year: vehicle.Year,
        Make: vehicle.Make,
        Model: vehicle.Model,
        VIN: vehicle.VIN,
        Value: vehicle.Value != null ? vehicle.Value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '',
        'Body Type': vehicle.BodyType,
        'Entered Date': vehicle.EnteredDateTime ? new Date(vehicle.EnteredDateTime).toLocaleDateString('en-US') : '',
        AccountName: vehicle.AccountName,
        LookUpcode: vehicle.LookUpcode,
        'Policy Name': vehicle.ChildPolicyName,
        Effective: vehicle.Effective ? new Date(vehicle.Effective).toLocaleDateString('en-US') : '',
        Expiration: vehicle.Expiration ? new Date(vehicle.Expiration).toLocaleDateString('en-US') : '',
        LineDesc: (vehicle.LineShortName && vehicle.LineShortName.trim() !== '') ? vehicle.LineShortName : vehicle.Description,
      }));
      filename = 'Endorsement vehicles.xlsx';
    } else {
      dataToExport = dataArray.slice(0, count).map(driver => ({
        AuthType: driver.AuthType ? driver.AuthType.toUpperCase() : '',
        'Entered Date': driver.EnteredDateTime ? new Date(driver.EnteredDateTime).toLocaleDateString('en-US') : '',
        DriverName: driver.DriverName,
        DateofBirth: driver.DateofBirth ? new Date(driver.DateofBirth).toLocaleDateString('en-US') : '',
        YearofLicenceIssued: driver.YearofLicenceIssued ? new Date(driver.YearofLicenceIssued).toLocaleDateString('en-US') : '',
        DriverLicenceNo: driver.DriverLicenceNo,
        'Driver Type': `${driver.DriverType || ''} - ${driver.DriverStage || ''} - ${driver.StateLicenced || ''}`,
        AccountName: driver.AccountName,
        LookUpcode: driver.LookUpcode,
        'Policy Name': driver.ChildPolicyName,
        Effective: driver.Effective ? new Date(driver.Effective).toLocaleDateString('en-US') : '',
        Expiration: driver.Expiration ? new Date(driver.Expiration).toLocaleDateString('en-US') : '',
        LineDesc: (driver.LineShortName && driver.LineShortName.trim() !== '') ? driver.LineShortName : driver.Description,
      }));
      filename = 'Endorsement Drivers.xlsx';
    }

    if (dataToExport.length === 0) {
      alert('No data to export!');
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);

    // Auto column width calculation
    const objectMaxLength: number[] = [];
    dataToExport.forEach(obj => {
      Object.keys(obj).forEach((key, i) => {
        const value = obj[key] ? obj[key].toString() : '';
        objectMaxLength[i] = Math.max(objectMaxLength[i] || 0, value.length, key.length);
      });
    });
    worksheet['!cols'] = objectMaxLength.map(w => ({ width: w + 5 }));

    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), filename);
  }

}
