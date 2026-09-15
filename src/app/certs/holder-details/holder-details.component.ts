import { ChangeDetectorRef, Component } from '@angular/core';
import { AddEditHolderDetailsComponent } from './add-edit-holder-details/add-edit-holder-details.component';
import { AllApiService } from '../../_service/all-api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { CertsPdfConverterComponent } from '../certs-pdf-converter/certs-pdf-converter.component';
import { catchError, throwError, timeout } from 'rxjs';
import { ApiUrl } from '../../_core/apiUrl';
import { SearchHolderPipe } from '../search-holder.pipe';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { ExtraVehicleDetailsComponent } from './extra-vehicle-details/extra-vehicle-details.component';
import { EnterVehicleDetialsByExcelComponent } from './enter-vehicle-detials-by-excel/enter-vehicle-detials-by-excel.component';
import { CertsAttachmentComponent } from './certs-attachment/certs-attachment.component';
import { CertsViewPolicyComponent } from './certs-view-policy/certs-view-policy.component';
import { NewCertsPdfConverterComponent } from '../new-certs-pdf-converter/new-certs-pdf-converter.component';
import { HolderRemakrsComponent } from './holder-remakrs/holder-remakrs.component';


@Component({
  selector: 'app-holder-details',
  standalone: true,
  imports: [CommonModule , MaterialModule ,SearchHolderPipe,SpinnerComponent],
  templateUrl: './holder-details.component.html',
  styleUrl: './holder-details.component.scss'
})
export class HolderDetailsComponent {
  AccountID:any;
  showSpiner = true;
  listOFHolderDetails:any=[];
   searchCriteria = {
    EnteredDateTime: '',
    EnteredBy: '',
    HoldingDetails: '',
    HoldingID:''
  };

 constructor(private http:AllApiService,private router:Router,private toastr: ToastrService,public dialog: MatDialog,
 private cdr: ChangeDetectorRef){}


ngOnInit(): void {
    
     this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
     this.getHolderDetails()
 
  }


   updateSearchCriteria(criteria: any) {
  this.searchCriteria = { ...this.searchCriteria, ...criteria };
  this.cdr.markForCheck(); // Notify Angular that changes have occurred
}

onEnteredDateTimeChange(newEnteredDateTime: string) {
  this.updateSearchCriteria({ EnteredDateTime: newEnteredDateTime });
  
}

onEnteredByChange(newEnteredBy: string) {
  this.updateSearchCriteria({ EnteredBy: newEnteredBy });
}

onHoldingDetailsChange(newHoldingDetails: string) {
  this.updateSearchCriteria({ HoldingDetails: newHoldingDetails });
}
onHoldingIDChange(newHoldingID: string) {
  this.updateSearchCriteria({ HoldingID: newHoldingID });
}

 getHolderDetails(){
   
    this.http.getAllDataId(ApiUrl.getAllHolderByAccountId,this.AccountID).pipe( timeout(35000), // Set the timeout to 45 seconds
        catchError(error => {
          if (error.name === 'TimeoutError') {
            alert('Internet is slow, please wait or check your connection.');
          } else {
            this.toastr.error('Something went wrong, please try again.', '', { timeOut: 3000 });
          }
          return throwError(() => error); // Ensure further error handling if necessary
        })).subscribe(
      data=>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        var obj  = JSON.parse(response)
        this.listOFHolderDetails = obj.HoldingDetail;
      this.listOFHolderDetails = obj.HoldingDetail.sort((a: any, b: any) => b.HoldingID - a.HoldingID);
        
      }
    )   
  }


  addEditHolder(data:any) {
    
    const dialogRef = this.dialog.open(AddEditHolderDetailsComponent, {
      data: {HoldingID:data.HoldingID,EnteredDateTime:data.EnteredDateTime,EnteredBy:data.EnteredBy,HoldingDetails:data.HoldingDetails,AccountID:data.AccountID},
      
    });
  
    
  }


 

   getCertificate(data:any) {
    
    const dialogRef = this.dialog.open(CertsPdfConverterComponent, {
      width: '1200px',
      height:'100%',
     
      data: {AccountId:data.AccountID,holderDetails:data.HoldingDetails,holderId:data.HoldingID},
      
    });
  
    
  }


  viewOfPolcy(data:any){
      const dialogRef = this.dialog.open(CertsViewPolicyComponent, {
         width: '1400px',
     
      data: {HoldingID:data.HoldingID},
    }); 
    
  }
  extraVehicleDetails(data:any) {
    const dialogRef = this.dialog.open(ExtraVehicleDetailsComponent, {
      width: '700px',
      data: {HoldingID:data.HoldingID},
    });  
  }
    extraVehicleDetailsByXecel(data:any) {
    const dialogRef = this.dialog.open(EnterVehicleDetialsByExcelComponent, {
      data: {AccountId:data.AccountID,holderDetails:data.HoldingDetails,HoldingID:data.HoldingID},
    });  
  }


   addEditAttachement(data:any) {
      
      if (!data.HoldingAttachmentExists) {
    const dialogRef = this.dialog.open(CertsAttachmentComponent, {
      width: '800px',
      height: '540px',
      data: { HoldingID: data.HoldingID }
    });
  } else {
      this.toastr.warning('An attachment already exists for this HoldingID.', 'Warning');
  
  }
  }

     nwCertsPdfConverterComponent(data:any) {
      
      {
    const dialogRef = this.dialog.open(NewCertsPdfConverterComponent, {
      width: '800px',
      height: '540px',
       data: {AccountId:data.AccountID,holderDetails:data.HoldingDetails,holderId:data.HoldingID},
    });
  } 
  }


  holderRemarks(data:any){
      {
    const dialogRef = this.dialog.open(HolderRemakrsComponent, {
     
       data: {AccountId:this.AccountID},
    });
  } 
    
  }

  goToAppication(){
    this.router.navigate(['/certs/application'])
  }


   goingToAttachemnt(data:any){
  
    this.router.navigate(['/certs/certsAttachment',this.AccountID])
   }


   

   

}
