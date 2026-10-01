import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { SearchFilterPipe } from '../../main-layout/acoount-details/search-filter.pipe';
import { AllApiService } from '../../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';
import { CommonModule } from '@angular/common';
import { AddEditVehicleComponent } from './add-edit-vehicle/add-edit-vehicle.component';
import { AddDataByExcelComponent } from './add-data-by-excel/add-data-by-excel.component';
import { AddEditDriverComponent } from '../driver/add-edit-driver/add-edit-driver.component';
import { DeleteVehicleComponent } from './delete-vehicle/delete-vehicle.component';
import { ReplaceAllVehicleComponent } from './replace-all-vehicle/replace-all-vehicle.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { SearchVehiclePipe } from '../../_SearchPipe/search-vehicle.pipe';
import { ConvertValueTozeroComponent } from './convert-value-tozero/convert-value-tozero.component';
@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule,MatButtonModule,FormsModule,SearchVehiclePipe ,MaterialModule ,HttpClientModule ,SpinnerComponent],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent {
showSpiner = true
listOfAllVehilce:any =[];
accountId ='';
accountName ='';
MarkedPolicyId:any;
ChildPolicyID:any;
IsChildPolicyExist:any
EndorsementID:any;
searchTerm: string = '';
listOfAllDeleteVehicle:any =[];
showGetDeleteButton = true;
showAllVehicle = false;
showSaveButtion = true;
UserName:any;
marketedName:any;
alAmountShowZero = true;
bodyTypeCounts: { [key: string]: number } = {};
searchCriteria = {
  Year: '',
  VIN: '',
  BodyType: '',
  Model:'',
};
constructor( private http:AllApiService,private router:Router,public dialog: MatDialog,private cdr: ChangeDetectorRef) { 
  this.http.listen().subscribe((m:any)=>{
    console.log(m)
     this.getAllallVehicleList()
  })
 }

 
 ngOnInit(): void {
  this.UserName = sessionStorage.getItem('UserName')
  if(this.UserName == null){
    this.router.navigate(['/login'])
   
}


  this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
  this.marketedName = localStorage.getItem('marketedName')
 
  if(this.marketedName !== 'AL'){
    this.alAmountShowZero = false
  }
  this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID')
  
  this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
  
  
  this.EndorsementID = localStorage.getItem('EndorsementID')
 

  if(this.EndorsementID == null){
    this.EndorsementID = '0'
  }
  else{
    this.EndorsementID = localStorage.getItem('EndorsementID')
  }
  this.IsChildPolicyExist = localStorage.getItem('IsChildPolicyExist')
  if(this.IsChildPolicyExist == 'true'){
    this.showSaveButtion = true
  }
  else{
    this.showSaveButtion = true
  }
  this.getAllallVehicleList()
  
}


updateSearchCriteria(criteria: any) {
  this.searchCriteria = { ...this.searchCriteria, ...criteria };
  this.cdr.markForCheck(); // Notify Angular that changes have occurred
}

onYearChange(newYear: string) {
  this.updateSearchCriteria({ Year: newYear });
  
}

onVINChange(newVIN: string) {
  this.updateSearchCriteria({ VIN: newVIN });
}

onBodyTypeChange(newBodyType: string) {
  this.updateSearchCriteria({ BodyType: newBodyType });
}
onModelChange(newModel: string) {
  this.updateSearchCriteria({ Model: newModel });
}





getAllDeleteVehicle(){
  
  this.getAllDeleteList();
  this.showGetDeleteButton = false
  this.showAllVehicle = true

}
getAllVehicle(){
  
  this.getAllallVehicleList();
  this.showGetDeleteButton = true
  this.showAllVehicle = false

}

getAllallVehicleList(){
  
  this.http.getAllDataByThreId(ApiUrl.getAllVehicleRecords,this.MarkedPolicyId,this.ChildPolicyID,this.EndorsementID).subscribe(
    data=>{
      this.showSpiner  = false ;
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response)
     this.listOfAllVehilce =  data?.Vehicles || [];;
     this.bodyTypeCounts = this.countBodyTypes();

    }
  )
}
countBodyTypes() {
  const bodyTypeCounts: { [key: string]: number } = {};
  
  if (this.listOfAllVehilce && Array.isArray(this.listOfAllVehilce)) {
    this.listOfAllVehilce.forEach(vehicle => {
      const bodyType = vehicle.BodyType;
      if (bodyType) {
        bodyTypeCounts[bodyType] = (bodyTypeCounts[bodyType] || 0) + 1;
      }
    });
  }
  
  return bodyTypeCounts;
}

getIcon(type: string): string {
  switch (type.toLowerCase()) {
    case 'tractor': return 'agriculture';
    case 'trailer': return 'local_shipping';
    case 'box truck': return 'inventory_2';
    case 'reefer': return 'ac_unit';
    case 'flatbed': return 'directions_car';
    default: return 'commute'; // fallback
  }
}
getAllDeleteList(){
  this.http.getAllDataByTwoId(ApiUrl.getDeleteVehicle,this.MarkedPolicyId,this.ChildPolicyID).subscribe(
    data=>{
      this.showSpiner  = false ;
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response)
     this.listOfAllDeleteVehicle = obj.Vehicles

    }
  )
}


openDialog(data:any) {
  
 
  const dialogRef = this.dialog.open(AddEditVehicleComponent, {
    disableClose: true,
    autoFocus: true,
    width: '750px',
    // height: '530px',
    data: {AccountID:this.accountId,VehicleID:data.VehicleID,
      ChildPolicyID:data.ChildPolicyID,
      EndorsementID:data.EndorsementID,
      MarkedPolicyID:data.MarkedPolicyID,
      Year:data.Year,
      Make:data.Make,
      Model:data.Model,
      BodyType:data.BodyType,
      VIN:data.VIN,
      OwnerShipType:data.OwnerShipType,
      VehicleType:data.VehicleType,
      Value:data.Value 
      ,EnteredBy:data.EnteredBy,
      Camera:data.Camera,
      TeleMatic:data.Telematic
    }
    
  });

  
}


converToZero(data:any) {
 
 
  const dialogRef = this.dialog.open(ConvertValueTozeroComponent, {
    disableClose: true,
    autoFocus: true,
    width: '400px',
    // height: '530px',
    data: {AccountID:data.AccountID,MarkedPolicyID:data.MarkedPolicyID,
     
     
    }
    
  });

  
}


addDataByExcelFile(data:any){

  
  const dialogRef = this.dialog.open(AddDataByExcelComponent, {
    width: '600px',
    height: '500px',
    data: {AccountID:this.accountId,VehicleID:data.VehicleID,
      ChildPolicyID:data.ChildPolicyID,
      EndorsementID:data.EndorsementID,
      MarkedPolicyID:data.MarkedPolicyID,
      Year:data.Year,
      Make:data.Make,
      Model:data.Model,
      BodyType:data.BodyType,
      VIN:data.VIN,
      OwnerShipType:data.OwnerShipType,
      VehicleType:data.VehicleType,
      Value:data.Value 
      ,EnteredBy:data.EnteredBy }
    
  });
  

}

replaceDataByExcleFile(data:any){

  
  const dialogRef = this.dialog.open(ReplaceAllVehicleComponent, {
    width: '600px',
    height: '500px',
    data: {AccountID:this.accountId,VehicleID:data.VehicleID,
      ChildPolicyID:data.ChildPolicyID,
      EndorsementID:data.EndorsementID,
      MarkedPolicyID:data.MarkedPolicyID,
      Year:data.Year,
      Make:data.Make,
      Model:data.Model,
      BodyType:data.BodyType,
      VIN:data.VIN,
      OwnerShipType:data.OwnerShipType,
      VehicleType:data.VehicleType,
      Value:data.Value 
      ,EnteredBy:data.EnteredBy }
    
  });

}




  // id =''
  // userName =''
  // delete(data:any) {
  //   this.id = data.VehicleID ;
  //   this.userName = data.VehicleType;
  //   this.EndorsementID;
  //   this.dialog.open(DeleteVehicleComponent ,{
  //     width: '450px',
  //     height:'265px',
  //     data:{VehicleID:this.id ,VehicleType:this.userName,EndorsementID:this.EndorsementID,ChildPolicyID:data.ChildPolicyID,AccountID:data.AccountID}

  //   });
    
  // }

  id = '';
userName = '';

delete(data: any) {

  this.id = data.VehicleID;
  this.userName = data.VehicleType;
  this.EndorsementID;

  const dialogRef = this.dialog.open(DeleteVehicleComponent, {
    width: '450px',
    height: '350px',
    data: {
      VehicleID: this.id,
      VehicleType: this.userName,
      EndorsementID: this.EndorsementID,
      ChildPolicyID: data.ChildPolicyID,
      AccountID: data.AccountID
    }
  });

  dialogRef.afterClosed().subscribe((result: any) => {

    if (result?.deleted === true) {

      // Call your existing API/list method here
      this.getAllallVehicleList();
    }

  });
}


  exportVehicleToExcel() {
    if (!this.listOfAllVehilce || this.listOfAllVehilce.length === 0) {
      alert('No data to export!');
      return;
    }

    // Format data for Excel
    const formattedData = this.listOfAllVehilce.map((vehicle:any) => ({
       'Year': vehicle.Year,
        'Make': vehicle.Make,
        'Model': vehicle.Model,
        'Body Type': vehicle.BodyType,
        'VIN': vehicle.VIN,
        'Vehicle Type': vehicle.VehicleType,
        'Value': vehicle.Value,
        'OwnershipType':vehicle.OwnerShipType,
        'Added By': vehicle.EnteredBy,
      
    }));

    // Create a worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);

    // Create a new workbook and append the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehicles');

    // Generate Excel file
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Convert to Blob and download
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, 'Vehicle_List.xlsx');
  }



}
