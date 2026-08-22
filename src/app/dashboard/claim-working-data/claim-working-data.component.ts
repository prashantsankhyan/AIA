import { ChangeDetectorRef, Component } from '@angular/core';
import { CommodityModule } from '../../detail-layout/commodity/commodity.module';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AllApiService } from '../../_service/all-api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';
import { ClaimsPipe } from '../../claims/add-edit-claims/_searchPipeForClaims/claims.pipe';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharingModule/material/material.module';
import * as XLSX from 'xlsx'; 
import { saveAs } from 'file-saver';
import { OpenClaimStatusComponent } from './open-claim-status/open-claim-status.component';

@Component({
  selector: 'app-claim-working-data',
  standalone: true,
  imports: [CommonModule,MaterialModule ,SpinnerComponent,ClaimsPipe],
  templateUrl: './claim-working-data.component.html',
  styleUrl: './claim-working-data.component.scss'
})
export class ClaimWorkingDataComponent {
   showSpiner = true
    AccountID:any
    listOfMoveClaim:any =[];
    ClaimID:any;
    confirmReason:any
    searchCriteria = {
      ClaimNumber: '',
      LineShortName: '',
      ReportedTo: '',
      DeleteReason:'',
        ChildPolicyName: '',
        AccountName:'',

    };
    
    constructor(private http:AllApiService,private cRouter:Router,private cdr: ChangeDetectorRef,public dialog: MatDialog,) { }
  
    ngOnInit(): void {
     
      localStorage.removeItem('claimAccountName');
      this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
      this.getAllData()
      
      localStorage.removeItem('confirmReason');
    }
  
    backToClaims(){
        this.cRouter.navigate(['/claims/listOfClaims'])
    }
    updateSearchCriteria(criteria: any) {
      this.searchCriteria = { ...this.searchCriteria, ...criteria };
      this.cdr.markForCheck(); // Notify Angular that changes have occurred
    }
    
    onClaimNumberChange(newClaimNumber: string) {
      this.updateSearchCriteria({ ClaimNumber: newClaimNumber });
      
    }
    
    onLineShortNameChange(newLineShortName: string) {
      this.updateSearchCriteria({ LineShortName: newLineShortName });
    }
    
    onReportedToChange(newReportedTo: string) {
      this.updateSearchCriteria({ ReportedTo: newReportedTo });
    }
       onDeleteReasonChange(newDeleteReason: string) {
      this.updateSearchCriteria({ DeleteReason: newDeleteReason });
    }
    onChildPolicyDescriptionChange(value: string) {
  this.updateSearchCriteria({
    ChildPolicyName: value
  });
}

onAccountNameChange(newAccountName: string) {
  this.updateSearchCriteria({
    AccountName: newAccountName
  });
}

    applyClaimConfirmSearch() {
  this.searchCriteria.DeleteReason = 'Claim Confirm';
  this.onDeleteReasonChange('Claim Confirm');
}
   clearDeleteReason() {
  this.searchCriteria.DeleteReason = '';
  this.onDeleteReasonChange(''); // if you want to reset filter logic
}


    getAllData(){
      this.http.getAllData(ApiUrl.getAllCalimDatawithoutAccountId).subscribe(
        data=>{
         
          let response = JSON.stringify(data)
          let obj  = JSON.parse(response)
          this.listOfMoveClaim = obj.Claims
          this.showSpiner = false
  
        }
      )
    }
  
  
    getListOfAdjustors(data:any){
      
      this.ClaimID = data.ClaimID;
      this.confirmReason = data.DeleteReason
     
      localStorage.setItem('confirmReason', this.confirmReason);
      this.cRouter.navigate(['/claims/adjustorsList',this.ClaimID])
    }
  
    // reverseClaim(data:any) {
    //   this.dialog.open(ReverseClaimComponent ,{
       
    //     data:{ClaimID:data.ClaimID}
  
    //   });
    // }


    updateStage(data:any){
     
      this.dialog.open(OpenClaimStatusComponent ,{
        width: '400px',
        height:'300px',
       data: {ClaimID:data.ClaimID}
      });
     }

getStageColor(stage: string): string {
  switch (stage) {
    case 'Slow Running':
      return '#ffff00'; // bright yellow
    case 'Information Panding':
      return '#ff8c00'; // dark orange/yellow
    case 'Unauthorised':
      return '#d32f2f'; // red
    case 'Under Review':
      return '#90ee90'; // light green
    case 'Pending From Team':
      return '#0000ff'; // blue
    case 'Done':
      return '#006400'; // dark green
    default:
      return 'transparent';
  }
}

getTextColor(stage: string): string {
  switch (stage) {
    case 'Slow Running':
      return 'black';
    case 'Information Panding':
    case 'Unauthorised':
    case 'Pending  From Team':
    return 'white';
    case 'Done':
      return 'white';
    case 'Under Review':
      return 'black';
    default:
      return 'black';
  }
}



    

exportToExcel() {
  if (!this.listOfMoveClaim || this.listOfMoveClaim.length === 0) {
    alert('No data to export!');
    return;
  }

  const formattedData = this.listOfMoveClaim.map((data: any) => ({
    'Policy Type': `${data.LineName} / ${data.LineShortName}`,
    'Claim Number': data.ClaimNumber,
    'Claim Type': data.ClaimType,
    'Reported To': data.ReportedTo,
    'Driver': data.DriverName ?? data.Driver ?? '',
    'Truck': data.Truck_VIN ?? data.Truck ?? '',
    'Trailer': data.Trailer_VIN ?? data.Trailer ?? '',
    'Information Received By': data.InformationReceivedBy,
    'Entered Date': data.EnteredDateTime ? new Date(data.EnteredDateTime).toLocaleDateString() : '',
    'Entered By': data.EnteredBy,
    'Claim Done': data.DeleteReason ?? ''
  }));

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Claim Export');

  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  const dataBlob: Blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(dataBlob, 'Claim_List_Export.xlsx');
}


}
