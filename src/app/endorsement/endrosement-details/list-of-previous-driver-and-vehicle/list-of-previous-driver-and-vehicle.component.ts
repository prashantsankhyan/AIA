import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../_service/all-api.service';
import { Router } from '@angular/router';
import { ApiUrl } from '../../../_core/apiUrl';
import { SearchDriverPipe } from '../../../_SearchPipe/search-driver.pipe';
import { SearchVehiclePipe } from '../../../_SearchPipe/search-vehicle.pipe';

@Component({
  selector: 'app-list-of-previous-driver-and-vehicle',
  standalone: true,
     imports: [CommonModule,MaterialModule,SpinnerComponent,SearchDriverPipe,SearchVehiclePipe],
  templateUrl: './list-of-previous-driver-and-vehicle.component.html',
  styleUrl: './list-of-previous-driver-and-vehicle.component.scss'
})
export class ListOfPreviousDriverAndVehicleComponent {
 showSpiner = true;
  AccountID:any;
  ChildPolicyID:any;
  MarkedPolicyID:any;
  EndorsementID:any;
  listOfAllDriver:any =[];
  listOfAllVehicle:any =[];
  listOfRemarks:any =[];
  driverLength:any;
  EndorsementType:any;
  showDriver = false;
  showVehicle = false;
  showRemarks  = false;
  searchCriteriaDrvier = {
    DriverName: '',
    DateofBirth: '',
    StateLicenced: '',
    DriverLicenceNo:'',
    
  
  };

  searchCriteriaVehicle = {
    Year: '',
    VIN: '',
    BodyType: '',
    Model:'',
  };
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private http:AllApiService,private router:Router,private cdr: ChangeDetectorRef,public dialog: MatDialog,public dialogRef: MatDialogRef<ListOfPreviousDriverAndVehicleComponent>) { 
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      this.getDriver()
    })
  }
  ngOnInit(): void {
    this.data; 
    this.MarkedPolicyID = this.data.MarkedPolicyID;
    this.ChildPolicyID = this.data.ChildPolicyID;
    this.EndorsementID = this.data.EndorsementID;
    this.EndorsementType = this.data.EndorsementType
   

   

   

  
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
   
    this.getDriver();
    this.getVehicle();
   
   
 }

 updateSearchCriteriaDrivers(criteria: any) {
  this.searchCriteriaDrvier = { ...this.searchCriteriaDrvier, ...criteria };
  this.cdr.markForCheck(); // Notify Angular that changes have occurred
}

onAttachmentDateChange(newAttachmentDate: string) {
  this.updateSearchCriteriaDrivers({ AttachmentDate: newAttachmentDate });
  
}

onDriverNameChange(newDriverName: string) {
  this.updateSearchCriteriaDrivers({ DriverName: newDriverName });
}

onDateofBirthChange(newDateofBirth: string) {
  this.updateSearchCriteriaDrivers({ DateofBirth: newDateofBirth });
}
onStateLicencedChange(newStateLicenced: string) {
  this.updateSearchCriteriaDrivers({ StateLicenced: newStateLicenced });
}

onDriverLicenceNoChange(newDriverLicenceNo: string) {
  this.updateSearchCriteriaDrivers({ DriverLicenceNo: newDriverLicenceNo });
}
 getDriver() {
  this.http.getAllDataByThreId(ApiUrl.getAllDriverRecord,this.MarkedPolicyID,this.ChildPolicyID,this.EndorsementID).subscribe(
    data => {
      this.showSpiner  = false ;
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response)
     this.listOfAllDriver = obj.Drivers
     this.driverLength = this.listOfAllDriver.length
    }
  );
}

updateSearchCriteriaVehicles(criteria: any) {
  this.searchCriteriaVehicle = { ...this.searchCriteriaVehicle, ...criteria };
  this.cdr.markForCheck(); // Notify Angular that changes have occurred
}

onYearChange(newYear: string) {
  this.updateSearchCriteriaVehicles({ Year: newYear });
  
}

onVINChange(newVIN: string) {
  this.updateSearchCriteriaVehicles({ VIN: newVIN });
}

onBodyTypeChange(newBodyType: string) {
  this.updateSearchCriteriaVehicles({ BodyType: newBodyType });
}
onModelChange(newModel: string) {
  this.updateSearchCriteriaVehicles({ Model: newModel });
}


getVehicle() {
  this.http.getAllDataByThreId(ApiUrl.getAllVehicleRecords,this.MarkedPolicyID,this.ChildPolicyID,this.EndorsementID).subscribe(
    data => {
      this.showSpiner  = false ;
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response)
     this.listOfAllVehicle =  data?.Vehicles;
   });}

   
  

   cancleModel(): void {
    this.dialogRef.close();
    
   
  }
}
