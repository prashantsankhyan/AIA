import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { ApiUrl } from '../../../_core/apiUrl';
import { AllApiService } from '../../../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewRemkarsPolicyIdComponent } from '../../../policy/view-remkars-policy-id/view-remkars-policy-id.component';
import { ViewRemakrsAccoutBaseComponent } from '../view-remakrs-accout-base/view-remakrs-accout-base.component';
import { CertsViewTruckDriverComponent } from '../certs-view-truck-driver/certs-view-truck-driver.component';
import { CabCardComponent } from '../cab-card/cab-card.component';
import { ListOfAllDriverTruckAndAnotherComponent } from '../../../policy/list-of-all-driver-truck-and-another/list-of-all-driver-truck-and-another.component';

@Component({
  selector: 'app-certs-view-policy',
  standalone: true,
    imports: [CommonModule,MaterialModule,SpinnerComponent],
  templateUrl: './certs-view-policy.component.html',
  styleUrl: './certs-view-policy.component.scss'
})
export class CertsViewPolicyComponent {
 showSpiner = true;
  ChildPolicyID:any;
  listOfPolicy:any =[];
  locationData:any;
  AccountID:any;
   showTaleIfempity = false;
  showTableIfDataHave = false;
  showEndrosementList = true;
  listOfEmpity:any;
  MarkedPolicyID:any;
    constructor(private http:AllApiService,public dialog: MatDialog,) { 
      this.http.listen().subscribe((m:any)=>{
        console.log(m)
        this.getPolicyByAccountId()
      })
    }
    ngOnInit(): void {
     
      this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
     
      this.getPolicyByAccountId();
    
  
  
  
   }
    viewRemkarsByChiledPolciy(data:any){
      this.dialog.open(ViewRemkarsPolicyIdComponent ,{
        width: '880px',
        height:'700px',
       data: {ChildPolicyID:data.ChildPolicyID,}
      });
      
    }

      viewAccountBane(data:any){
      this.dialog.open(ViewRemakrsAccoutBaseComponent ,{
        width: '880px',
        height:'700px',
       data: {AccountID:data.AccountID,}
      });
      
    }

    
   getPolicyByAccountId(){
  this.http.getAllDataId(ApiUrl.getAllPolicyByAccountId,this.AccountID).subscribe(
    data=>{
      this.showSpiner = false
      let response = JSON.stringify(data)
      var obj  = JSON.parse(response)
      let length = obj.ChildPolicys.length
      if(length == '0'){
        this.listOfEmpity = ' No data Found'
        this.showTaleIfempity = true;
       
      }else{
        this.showTableIfDataHave = true
        this.listOfPolicy = obj.ChildPolicys ;
       
      }


    }
  )   
}




// listOfDriverTruckData(data:any) {
  
//   this.MarkedPolicyID = data.MarkedPolicyID
 
//   const dialogRef = this.dialog.open(CertsViewTruckDriverComponent, {
//     width: '1400px',
//     height: '700px',
//     data: {MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:data.ChildPolicyID},
    
//   });
// }

listOfDriverTruckData(data:any) {
  
  this.MarkedPolicyID = data.MarkedPolicyID
 
  const dialogRef = this.dialog.open(ListOfAllDriverTruckAndAnotherComponent, {
    width: '1400px',
    height: '700px',
    data: {MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:data.ChildPolicyID},
    
  });
}



cabCard(data:any) {
  
  this.MarkedPolicyID = data.MarkedPolicyID
 
  const dialogRef = this.dialog.open(CabCardComponent, {
    width: '800px',
    height: '700px',
    data: {MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:data.ChildPolicyID},
    
  });
}



}
