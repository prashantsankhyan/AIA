import { Component } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';


import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { PolicyNavComponent } from './policy-nav/policy-nav.component';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../sharingModule/material/material.module';
import { SpinnerComponent } from '../spinner/spinner.component';
import { AllApiService } from '../_service/all-api.service';
import { ApiUrl } from '../_core/apiUrl';
import { AddEditPolicyComponent } from './add-edit-policy/add-edit-policy.component';
import { AddStageComponent } from './add-stage/add-stage.component';
import { AddEditEndrosementComponent } from './add-edit-endrosement/add-edit-endrosement.component';
import { AddEditDriverComponent } from '../detail-layout/driver/add-edit-driver/add-edit-driver.component';
import { RenewPolicyComponent } from './renew-policy/renew-policy.component';
import { AddEditVehicleComponent } from '../detail-layout/vehicle/add-edit-vehicle/add-edit-vehicle.component';
import { AddEndrosementStageComponent } from './add-endrosement-stage/add-endrosement-stage.component';
import { ListOfEndrosementComponent } from './list-of-endrosement/list-of-endrosement.component';
import { DeletePolicyComponent } from './delete-policy/delete-policy.component';
import { ExpirePolicyListComponent } from './expire-policy-list/expire-policy-list.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CurrentDeleteComponent } from './current-delete/current-delete.component';

import { ListOfRenewPolcyComponent } from './list-of-renew-polcy/list-of-renew-polcy.component';
import { ListOfAllDriverTruckAndAnotherComponent } from './list-of-all-driver-truck-and-another/list-of-all-driver-truck-and-another.component';
import { ViewRemkarsPolicyIdComponent } from './view-remkars-policy-id/view-remkars-policy-id.component';
import { AddPolicyRepotingStatusComponent } from './add-policy-repoting-status/add-policy-repoting-status.component';

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [PolicyNavComponent,CommonModule,MaterialModule,SpinnerComponent],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.scss'
})
export class PolicyComponent {
  showSpiner = true;
  ChildPolicyID:any;
  listOfPolicy:any =[];
  locationData:any;
  AccountID:any;
  MarkedPolicyID='';
  savePermission:any;
  updatePermissin:any;
  deletePermission:any;
  listOfEndorsements:any =[];
  listOfPoliceLineDetail:any =[];
  showEndoresmetDiv = false ;
  showLodingMessage = false;
  listOfEmpity:any;
  showTaleIfempity = false;
  showTableIfDataHave = false;
  showEndrosementList = true;
  EndorsementType:any;
  EndorsementID ='0'
  selectedTabLabel: string = '';
  descriptionClient:any;
  City:any;
  State:any;
  ZIP:any;
  fullAddress:any;
  GaragingCity:any;
  GaragingState:any;
  GaragingPinCode:any;
  GaragingAddress:any;
  constructor(private http:AllApiService,private router:Router,public dialog: MatDialog,) { 
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      this.getPolicyByAccountId()
    })
  }
  ngOnInit(): void {
    this.clearLocalStorage()
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
   
    this.getPolicyByAccountId();
    this.descriptionClient = localStorage.getItem('descriptionClient');
    this.City =localStorage.getItem('City');
    this.State =localStorage.getItem('State');
    this.ZIP =localStorage.getItem('ZIP');

    this.fullAddress = JSON.parse(localStorage.getItem('locationData') || '{}');
    this.GaragingCity = localStorage.getItem('GaragingCity')
    this.GaragingState = localStorage.getItem('GaragingState')
     this.GaragingPinCode = localStorage.getItem('GaragingPinCode')
     this.GaragingAddress = localStorage.getItem('GaragingAddress')

    console.log(this.GaragingCity)



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
onTabChange(event: MatTabChangeEvent) {
  this.selectedTabLabel = event.tab.textLabel;
  this.handleTabSelection(this.selectedTabLabel);
}

onTabClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const tabLabel = target.textContent?.trim();

  if (tabLabel && tabLabel === this.selectedTabLabel) {
    this.handleTabSelection(tabLabel);
  }
}

handleTabSelection(tabLabel: string) {
  switch (tabLabel) {
    
    case 'Expired Data':
      this.expirePolicyList();
      break;
    case 'Current Delete':
      this.currentDeleteList();
      break;
    case 'All Renew':
     this.listOfRenewable()
      break;
      case 'Add Poliy':
      this.addPolicyHere();
      break;
    default:
      // Do nothing or handle other cases
      break;
  }
}


editPolicy(data:any) {
  this.ChildPolicyID = data.ChildPolicyID
  this.MarkedPolicyID = data.MarkedPolicyID
 
  const dialogRef = this.dialog.open(AddEditPolicyComponent, {
    width: '1400px',
    height: '400px',
    data: {ChildPolicyID:this.ChildPolicyID,MarkedPolicyID:this.MarkedPolicyID},
    
  });
}
listOfAllData(data:any) {
  
  this.MarkedPolicyID = data.MarkedPolicyID
 
  const dialogRef = this.dialog.open(ListOfAllDriverTruckAndAnotherComponent, {
    width: '1400px',
    height: '700px',
    data: {MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:data.ChildPolicyID},
    
  });
}

goDoDetailPage(data:any){
  this.MarkedPolicyID = data.MarkedPolicyID;
  let ChildPolicyID = data.ChildPolicyID;
 
  let EndorsementID ='0';
  let IsChildPolicyExist = data.Ischildpolicyexist;
  
  let marketedName = data.LineShortName
  localStorage.setItem('MarkedPolicyID', this.MarkedPolicyID)
  localStorage.setItem('ChildPolicyID', ChildPolicyID)
  localStorage.setItem('EndorsementID', EndorsementID)
  localStorage.setItem('IsChildPolicyExist', IsChildPolicyExist)
  localStorage.setItem('marketedName', marketedName)
  
  this.router.navigate(['/detailLayout'])
}


renewPolicy(data:any){
  this.dialog.open(RenewPolicyComponent ,{
    width: '400px',
    height:'550px',
   data: {ChildPolicyID:data.ChildPolicyID,LineName:data.LineName,LineShortName:data.LineShortName}
  });
  
}


viewRemkarsByChiledPolciy(data:any){
  this.dialog.open(ViewRemkarsPolicyIdComponent ,{
    width: '880px',
    height:'700px',
   data: {ChildPolicyID:data.ChildPolicyID,}
  });
  
}

updateStage(data:any){
  this.ChildPolicyID = data.ChildPolicyID
  this.dialog.open(AddStageComponent ,{
    width: '400px',
    height:'300px',
   data: {ChildPolicyID:this.ChildPolicyID }
  });
 }
   
 addEndrocement(data:any){
  this.dialog.open(AddEditEndrosementComponent ,{
    width: '400px',
    height:'460px',
   data: {MarkedPolicyID:data.MarkedPolicyID,AccountID:data.AccountID,ChildPolicyID:data.ChildPolicyID ,EndorsementID:data.EndorsementID,Description:data.Description,Effective:data.Effective }
  });
  
}
getEndrosementList(data:any){
  this.showEndrosementList = true;
  this.MarkedPolicyID = data.MarkedPolicyID;
  this.ChildPolicyID = data.ChildPolicyID
  this.showEndoresmetDiv = true
  this.getAllEndroesemnt();
  this.dialog.open(ListOfEndrosementComponent ,{
    width: '1400px',
    height: '700px',
   data: {MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:this.ChildPolicyID,EndorsementID:this.EndorsementID,LineShortName:data.LineShortName ,}
  });
}

getAllEndroesemnt(){
  this.http.getAllDataByTwoId(ApiUrl.getAllEndrosementByPolicyId,this.MarkedPolicyID,this.ChildPolicyID).subscribe(
    data=>{
      let respone  = JSON.stringify(data)
      let obj = JSON.parse(respone)
      
      this.listOfEndorsements = obj.Endorsements
      this.showEndrosementList = false
      console.log(this.listOfEndorsements)
      
    }
  )
}
deletePolicy(data:any){
  this.dialog.open(DeletePolicyComponent ,{
    width: '400px',
    height:'300px',
   data: {ChildPolicyID:data.ChildPolicyID }
  });
}

addPlicyRepostingStatus(data:any){
  this.dialog.open(AddPolicyRepotingStatusComponent ,{
    width: '400px',
    height:'410px',
   data: {ChildPolicyID:data.ChildPolicyID }
  });
}


expirePolicyList(){
  this.dialog.open(ExpirePolicyListComponent ,{
    width: '1400px',
    height:'700px',
   
  });
}
currentDeleteList(){
  this.dialog.open(CurrentDeleteComponent ,{
    width: '1400px',
    height:'700px',
   
  });
}
addPolicyHere() {
  this.ChildPolicyID= 0
 
  const dialogRef = this.dialog.open(AddEditPolicyComponent, {
    width: '1400px',
    height: '320px',
    data: {ChildPolicyID:this.ChildPolicyID},
  });
}


listOfRenewable(){
  this.dialog.open(ListOfRenewPolcyComponent ,{
    width: '1400px',
    height:'700px',
   
  });
}

goToChickOrVistEndroseemtLine(data:any){
  this.EndorsementID =data.EndorsementID;
 
  this.ChildPolicyID = data.ChildPolicyID;
  
  this.MarkedPolicyID = data.MarkedPolicyID
 
  this.EndorsementType = data.EndorsementType;

  if(this.EndorsementType =='Driver'){
          
    this.addDriverByEndrosement()
    this.router.navigate(['/detailLayout/driver'])
    localStorage.setItem('MarkedPolicyID',this.MarkedPolicyID )
    localStorage.setItem('ChildPolicyID', this.ChildPolicyID)
    localStorage.setItem('EndorsementID',  this.EndorsementID)
    
    localStorage.setItem('IsChildPolicyExist', 'false')
    

  }else if(this.EndorsementType =='Truck') {
    this.addUnitByEndrosement()
    this.router.navigate(['/detailLayout/vehicle'])
    localStorage.setItem('MarkedPolicyID',this.MarkedPolicyID )
    localStorage.setItem('ChildPolicyID', this.ChildPolicyID)
    localStorage.setItem('EndorsementID',  this.EndorsementID)
    localStorage.setItem('IsChildPolicyExist', 'false')
   

  }else if(this.EndorsementType =='Trailer') {
    this.addUnitByEndrosement()
    this.router.navigate(['/detailLayout/vehicle'])
    localStorage.setItem('MarkedPolicyID',this.MarkedPolicyID )
    localStorage.setItem('ChildPolicyID', this.ChildPolicyID)
    localStorage.setItem('EndorsementID',  this.EndorsementID)
    localStorage.setItem('IsChildPolicyExist', 'false')
 
  }
  else{
   
  }

}

addDriverByEndrosement(){
  this.dialog.open(AddEditDriverComponent ,{
    width: '800px',
    height: '500px',
   data: {MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:this.ChildPolicyID,EndorsementID:this.EndorsementID,}
  });
}
addUnitByEndrosement(){
  this.dialog.open(AddEditVehicleComponent ,{
    width: '800px',
    height: '500px',
   data: {MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:this.ChildPolicyID,EndorsementID:this.EndorsementID,}
  });
}
updateEndrosement(data:any){
  this.dialog.open(AddEditEndrosementComponent ,{
    width: '400px',
    height:'550px',
   data: {MarkedPolicyID:data.MarkedPolicyID,AccountID:data.AccountID,EndorsementType:data.EndorsementType,ChildPolicyID:data.ChildPolicyID ,EndorsementID:data.EndorsementID,Code:data.Code,Description:data.Description,EffectiveDateChange:data.EffectiveDateChange,EnteredBy:data.EnteredBy,ChangedBy:data.ChangedBy,UpdatedBy:data.UpdatedBy }
  });
}

   EndorsementUpdateId =''

  addStageInEndrosement(data:any){
    this.EndorsementUpdateId = data.EndorsementID;
   
 
    this.dialog.open(AddEndrosementStageComponent ,{
      width: '400px',
      height:'300px',
     data: {EndorsementID:this.EndorsementUpdateId,MarkedPolicyID:data.MarkedPolicyID,ChildPolicyID:data.ChildPolicyID }
    });
    

  }
  getFullAddressTooltip() {
  const addr = this.fullAddress;
  return `${addr.City} - ${addr.State} - ${addr.ZIP} - ${addr.Description || ''}`;
}

getGaragingAddressTooltip() {
  return `${this.GaragingCity} - ${this.GaragingState} - ${this.GaragingPinCode} - ${this.GaragingAddress}`;
}
 
getRowStyles(data: any) {
  if (data.IsTemporaryDelete) {
    return { 'background-color': '#ff000061', color: 'white' };
  }
  return { 'background-color': 'white', color: 'black' };
}



  listOfAttachemnt(){
    // this.router.navigate(['./attachment'])
    this.router.navigate(['/policy/attachment'])
  }


clearLocalStorage(){
  localStorage.removeItem('EndorsementID');
  localStorage.removeItem('ChildPolicyID')
  localStorage.removeItem('MarkedPolicyID')
 
  localStorage.removeItem('ChildPolicyID')
  localStorage.removeItem('EndorsementID')
  localStorage.removeItem('marketedName')
  localStorage.removeItem('IsChildPolicyExist')
}




}
