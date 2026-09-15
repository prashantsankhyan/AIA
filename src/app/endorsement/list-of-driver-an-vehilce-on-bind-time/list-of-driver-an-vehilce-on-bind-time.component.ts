import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../_core/apiUrl';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-list-of-driver-an-vehilce-on-bind-time',
  standalone: true,
  imports: [CommonModule,MatButtonModule,HttpClientModule,FormsModule],
  templateUrl: './list-of-driver-an-vehilce-on-bind-time.component.html',
  styleUrl: './list-of-driver-an-vehilce-on-bind-time.component.scss'
})
export class ListOfDriverAnVehilceOnBindTimeComponent {

showEndrosementList = true;
  searchText: string = '';
  ChildPolicyID:any;
  MarkedPolicyID:any;
  EndrosememtId ='0'
  listOfAllData:any =[];
 filteredDrivers: any[] = []; filteredVehicles: any[] = [];
 
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private http:AllApiService,private toastr: ToastrService,
  private cRouter:ActivatedRoute,private router: Router,
  public dialog: MatDialog,public dialogRef: MatDialogRef<ListOfDriverAnVehilceOnBindTimeComponent>){}
  ngOnInit(): void {
    this.data;
    this.MarkedPolicyID = this.data.MarkedPolicyID; 
    this.ChildPolicyID = this.data.ChildPolicyID;

    
     this.getListOfAllData()

   }




getListOfAllData(): void {

  this.http.getAllDataByTwoId(
    ApiUrl.policyTimeAddVehicleOrDriver,
    this.MarkedPolicyID,
    this.ChildPolicyID
  ).subscribe({

    next: (data: any) => {

      console.log('API Response:', data);

      this.listOfAllData = data || {};

      this.filteredDrivers =
        Array.isArray(data?.Drivers)
          ? data.Drivers
          : [];

      this.filteredVehicles =
        Array.isArray(data?.Vehicles)
          ? data.Vehicles
          : [];

      console.log('Drivers:', this.filteredDrivers);
      console.log('Vehicles:', this.filteredVehicles);

      this.showEndrosementList = false;
    },

    error: (error) => {

      console.error('API Error:', error);

      this.listOfAllData = {};

      this.filteredDrivers = [];
      this.filteredVehicles = [];
    }
  });
}





onSearchChange(): void {

  const search = String(this.searchText || '')
    .trim()
    .toLowerCase();

  const drivers = Array.isArray(this.listOfAllData?.Drivers)
    ? this.listOfAllData.Drivers
    : [];

  const vehicles = Array.isArray(this.listOfAllData?.Vehicles)
    ? this.listOfAllData.Vehicles
    : [];


  // No search
  if (!search) {

    this.filteredDrivers = [...drivers];
    this.filteredVehicles = [...vehicles];

    return;
  }


  // Drivers
  this.filteredDrivers = drivers.filter((driver: any) => {

    return [
      driver?.DriverName,
      driver?.DriverLicenceNo,
      driver?.StateLicenced,
      driver?.DriverType,
      driver?.DriverStage,
      driver?.RenewalStatus
    ].some(value =>
      String(value || '')
        .toLowerCase()
        .includes(search)
    );

  });


  // Vehicles
  this.filteredVehicles = vehicles.filter((vehicle: any) => {

    return [
      vehicle?.VehicleType,
      vehicle?.Year,
      vehicle?.Make,
      vehicle?.Model,
      vehicle?.VIN,
      vehicle?.VehicleVIN,
      vehicle?.PlateNo,
      vehicle?.LicensePlate,
      vehicle?.State
    ].some(value =>
      String(value || '')
        .toLowerCase()
        .includes(search)
    );

  });

}





  closeModel(): void {
    this.dialogRef.close();
   
  }
}

