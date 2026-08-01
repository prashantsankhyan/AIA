import { CommonModule } from '@angular/common';
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
import { AddEditDriverComponent } from './add-edit-driver/add-edit-driver.component';
import { ApiUrl } from '../../_core/apiUrl';
import { AddEditRemarksComponent } from '../remarks/add-edit-remarks/add-edit-remarks.component';
import { DeleteDriverComponent } from './delete-driver/delete-driver.component';
import { EditDataByExcelComponent } from './edit-data-by-excel/edit-data-by-excel.component';
import { ReplaceAllDriverComponent } from './replace-all-driver/replace-all-driver.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { SearchDriverPipe } from '../../_SearchPipe/search-driver.pipe';


@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule,MatButtonModule,FormsModule,SearchDriverPipe ,MaterialModule ,HttpClientModule ,SpinnerComponent],
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.scss'
})
export class DriverComponent {
showSpiner = true
listOfAllDriver:any =[];
accountId ='';
accountName ='';
MarkedPolicyId:any;
ChildPolicyID:any;
IsChildPolicyExist:any
EndorsementID:any;
searchTerm: string = '';
userName:any;
allDeleteDriverList:any =[];
showGetDeleteButton = true;
showAllVehicle = false;
showSaveButtion = true;
driverLength:any;
teamName:any
searchCriteria = {
  DriverName: '',
  DateofBirth: '',
  StateLicenced: '',
  DriverLicenceNo:'',
  

};
constructor( private http:AllApiService,private router:Router,public dialog: MatDialog,private cdr: ChangeDetectorRef) { 
  this.http.listen().subscribe((m:any)=>{
    console.log(m)
    this.getAllDriverList()
  })
 }

ngOnInit(): void {
  this.userName = sessionStorage.getItem('UserName')
 
  if(this.userName == null){
    this.router.navigate(['/login'])
   
}
    this.teamName =localStorage.getItem('teamName');
   
  this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
  this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID')
 
  this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
  
  this.EndorsementID = localStorage.getItem('EndorsementID')
  
  
  this.IsChildPolicyExist = localStorage.getItem('IsChildPolicyExist')
 
  if(this.IsChildPolicyExist == 'true'){
    this.showSaveButtion = true
  }
  else{
    this.showSaveButtion = true
  }
  this.getAllDriverList()
}

updateSearchCriteria(criteria: any) {
  this.searchCriteria = { ...this.searchCriteria, ...criteria };
  this.cdr.markForCheck(); // Notify Angular that changes have occurred
}

onAttachmentDateChange(newAttachmentDate: string) {
  this.updateSearchCriteria({ AttachmentDate: newAttachmentDate });
  
}

onDriverNameChange(newDriverName: string) {
  this.updateSearchCriteria({ DriverName: newDriverName });
}

onDateofBirthChange(newDateofBirth: string) {
  this.updateSearchCriteria({ DateofBirth: newDateofBirth });
}
onStateLicencedChange(newStateLicenced: string) {
  this.updateSearchCriteria({ StateLicenced: newStateLicenced });
}

onDriverLicenceNoChange(newDriverLicenceNo: string) {
  this.updateSearchCriteria({ DriverLicenceNo: newDriverLicenceNo });
}

getAllDeleteDriver(){
  
  this.getAllDeleteDriverList();
  this.showGetDeleteButton = false
  this.showAllVehicle = true

}
getAllDriver(){
  
  this.getAllDriverList();
  this.showGetDeleteButton = true
  this.showAllVehicle = false

}

capitalizeFirstLetter(value: string | null | undefined): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
isAuthorized(value: string | null | undefined): boolean {
  if (!value) return false;
  const formatted = value.toLowerCase();
  return formatted === 'authorize' || formatted === 'authorized';
}

getAllDriverList(){
  
  this.http.getAllDataByThreId(ApiUrl.getAllDriverRecord,this.MarkedPolicyId,this.ChildPolicyID,this.EndorsementID).subscribe(
    data=>{
      this.showSpiner  = false ;
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response)
    //  this.listOfAllDriver = obj.Drivers;

    this.listOfAllDriver = obj.Drivers.map((driver: any) => ({
      ...driver,
      Experience: this.getDriverExperience(driver.YearofLicenceIssued) // Calculate experience dynamically
    }));
     
     this.driverLength = this.listOfAllDriver.length
 
    }
  )
}


getDriverExperience(issuedDate: string): string {
  if (!issuedDate) return 'N/A';

  const issued = new Date(issuedDate);
  const today = new Date();

  let years = today.getFullYear() - issued.getFullYear();
  let months = today.getMonth() - issued.getMonth();
  let days = today.getDate() - issued.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} Year${years !== 1 ? 's' : ''}, ${months} Month${months !== 1 ? 's' : ''}`;
}

getAllDeleteDriverList(){
  this.http.getAllDataByTwoId(ApiUrl.getAllDeleteDriver,this.MarkedPolicyId,this.ChildPolicyID).subscribe(
    data=>{
      this.showSpiner  = false ;
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response)
     this.allDeleteDriverList = obj.Drivers

    }
  )

}

isRealDate(value: string): boolean {
  // Skip if it's one of the keywords
  const excludedValues = ['Blank', 'Excluded', 'Pending', 'MM/dd/yyyy'];
  if (!value || excludedValues.includes(value)) return false;

  // Try to parse the date
  const date = new Date(value);
  return !isNaN(date.getTime());
}





addEditDriver(data:any) {
  
 
  const dialogRef = this.dialog.open(AddEditDriverComponent, {
    width: '800px',
    // height: '700px',
    data: {DriverID:data.DriverID ,AccountID:this.accountId,DriverName:data.DriverName,ChildPolicyID:data.ChildPolicyID, MarkedPolicyID:data.MarkedPolicyID ,YearofLicenceIssued:data.YearofLicenceIssued ,DateofBirth:data.DateofBirth ,StateLicenced:data.StateLicenced,DateofAdded:data.DateofAdded,Action:data.Action
      ,Description:data.Description,DriverStage:data.DriverStage,DriverType:data.DriverType,EndorsementID:data.EndorsementID, AuthType:data.AuthType,MailReceived:data.MailReceived,Stage:data.Stage,EffectiveDate:data.EffectiveDate,EnteredBy:data.EnteredBy,MartialStatus:data.MartialStatus,Gender:data.Gender,DriverLicenceNo:data.DriverLicenceNo }
    
  });

  
}


addDataByExcelFile(data:any){

  
  const dialogRef = this.dialog.open(EditDataByExcelComponent, {
    width: '600px',
    height: '500px',
    data: {DriverID:data.DriverID ,AccountID:this.accountId,DriverName:data.DriverName,ChildPolicyID:data.ChildPolicyID, MarkedPolicyID:data.MarkedPolicyID ,YearofLicenceIssued:data.YearofLicenceIssued ,DateofBirth:data.DateofBirth ,StateLicenced:data.StateLicenced,DateofAdded:data.DateofAdded,Action:data.Action
      ,Description:data.Description,DriverStage:data.DriverStage,DriverType:data.DriverType,EndorsementID:data.EndorsementID, AuthType:data.AuthType,MailReceived:data.MailReceived,Stage:data.Stage,EffectiveDate:data.EffectiveDate,EnteredBy:data.EnteredBy,MartialStatus:data.MartialStatus,Gender:data.Gender,DriverLicenceNo:data.DriverLicenceNo }
    
  });
}


replaceDataByExcleFile(data:any){

  
  const dialogRef = this.dialog.open(ReplaceAllDriverComponent, {
    width: '600px',
    height: '500px',
    data: {DriverID:data.DriverID ,AccountID:this.accountId,DriverName:data.DriverName,ChildPolicyID:data.ChildPolicyID, MarkedPolicyID:data.MarkedPolicyID ,YearofLicenceIssued:data.YearofLicenceIssued ,DateofBirth:data.DateofBirth ,StateLicenced:data.StateLicenced,DateofAdded:data.DateofAdded,Action:data.Action
      ,Description:data.Description,DriverStage:data.DriverStage,DriverType:data.DriverType,EndorsementID:data.EndorsementID, AuthType:data.AuthType,MailReceived:data.MailReceived,Stage:data.Stage,EffectiveDate:data.EffectiveDate,EnteredBy:data.EnteredBy,MartialStatus:data.MartialStatus,Gender:data.Gender,DriverLicenceNo:data.DriverLicenceNo }
    
  });
}




  id =''
  delete(data:any) {
    this.id = data.DriverID;
     
    if(this.teamName ==='Endorsement Team'){
    this.EndorsementID 
    
    this.dialog.open(DeleteDriverComponent ,{
      width: '450px',
      height:'270px',
      data:{DriverID:this.id ,EndorsementID:this.EndorsementID}

    });
    }
    else {
 this.EndorsementID = data.EndorsementID
    this.dialog.open(DeleteDriverComponent ,{
      width: '450px',
      height:'270px',
      data:{DriverID:this.id ,EndorsementID:this.EndorsementID}

    });
    }
    
   
    
  }

  exportToExcel() {
    if (!this.listOfAllDriver || this.listOfAllDriver.length === 0) {
      alert('No data to export!');
      return;
    }

    // Convert data into a structured format for Excel
    const formattedData = this.listOfAllDriver.map((data:any) => ({
      'Driver Name': data.DriverName,
      'Driver Stage': data.DriverStage,
      'Date of Birth': new Date(data.DateofBirth).toLocaleDateString(),
      'Year of License Issued': new Date(data.YearofLicenceIssued).toLocaleDateString(),
      
      'State Licensed': data.StateLicenced,
      'Driver Licence No': data.DriverLicenceNo,
      'Experience': data.Experience,
      
      Age: data.Age,
    
      
      'Enter By ': data.EnteredBy,
      'Update By': data.EnteredBy,
    }));

    // Create a worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);

    // Create a new workbook and append the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Deleted Drivers');

    // Generate the Excel file
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Convert buffer to a Blob and save the file
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, 'Driver_List.xlsx');
  }

}
