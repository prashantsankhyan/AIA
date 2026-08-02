import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { AllApiService } from '../../../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../../_core/apiUrl';
import { AddEditClaimsComponent } from '../add-edit-claims/add-edit-claims.component';
import { ConfirmClaimComponent } from '../../confirm-claim/confirm-claim.component';
import { DoneItComponent } from '../../done-claims/done-it/done-it.component';
import { ClaimsPipe } from '../_searchPipeForClaims/claims.pipe';
import { AddEditNoteComponent } from '../add-edit-note/add-edit-note.component';
import { ListOfNoteComponent } from '../list-of-note/list-of-note.component';
import { LossNoticeClaimsComponent } from '../loss-notice-claims/loss-notice-claims.component';
import { ViewRemkarsPolicyIdComponent } from '../../../policy/view-remkars-policy-id/view-remkars-policy-id.component';

@Component({
  selector: 'app-list-of-claims',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule ,SpinnerComponent,ClaimsPipe],
  templateUrl: './list-of-claims.component.html',
  styleUrl: './list-of-claims.component.scss'
})
export class ListOfClaimsComponent {
 showSpiner = true
  allList:any =[]
  AccountID ='';
  MarkedPolicyId:any;
  EndorsementID:any;
  userPermission:any;
  ClaimID='';
  userPermissionList:any =[];
  employeePermission:any;
  pagePermission:any;
  savePermission:any;
  updatePermissin:any;
  deletePermission:any;
  LineName ='';
  showMove =true; 
  showbutton = true;
  id:any;
  listOfEmpity:any;
  listOfPolicy:any =[];
  showTaleIfempity = false;
  showTableIfDataHave = false;
  searchCriteria = {
    ClaimNumber: '',
    LineShortName: '',
    ReportedTo: '',
  };
  accountName:any;
  constructor(private http:AllApiService,private router:ActivatedRoute,private cRouter:Router,public dialog: MatDialog,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    localStorage.removeItem('confirmReason');
    this.userPermission = localStorage.getItem('userPermissiondetail')
    
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.accountName = localStorage.getItem('claimAccountName') || '';
    
    this.getAllData();
    this.getPolicyByAccountId();
    
  }

  getListOfDoneClaims(){
    this.cRouter.navigate(['/claims/doneClaims'])
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

  backToDashboarc(){
    this.cRouter.navigate(['/dashboard/_dashboard'])

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
viewRemkarsByChiledPolciy(data:any){
  this.dialog.open(ViewRemkarsPolicyIdComponent ,{
    width: '880px',
    height:'700px',
   data: {ChildPolicyID:data.ChildPolicyID,}
  });
  
}
 
  getAllData(){
    this.http.getAllDataId(ApiUrl.getAllClaim,this.AccountID).subscribe(
      data=>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        let obj  = JSON.parse(response)
        this.allList = obj.Claims

      }
    )
  }

  getAllMoveData(){
    this.http.getAllDataId(ApiUrl.getMoveData,this.AccountID).subscribe(
      data=>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        let obj  = JSON.parse(response)
        this.allList = obj.Claims

      }
    )
  }

 addEditNote(data:any) {
   
    this.dialog.open(AddEditNoteComponent ,{
    
       data:{ClaimID:data.ClaimID}
    });
    
  }

   viewOfNote(data:any) {
   
    this.dialog.open(ListOfNoteComponent ,{
    
       data:{ClaimID:data.ClaimID}
    });
    
  }

  


 
 
  // moveToClaima(data:any) {
  //   this.id = data.ClaimID;
  //   this.dialog.open(MoveClaimComponent ,{
  //     width: '450px',
  //     height:'300px',
  //     data:{ClaimID:this.id  }

  //   });
    
  // }




  addEditClaims(data?:any) {
    this.dialog.open(AddEditClaimsComponent ,{
      
     
      data: {ClaimID:data.ClaimID }

    });
    if(!!data){
      data.content?.patchValue(data)
    }
   
  }

    lossNoticeClaim(data?:any) {
    this.dialog.open(LossNoticeClaimsComponent ,{
      
    height:'50px',
      
      data: {ClaimID:data.ClaimID }

    });
    if(!!data){
      data.content?.patchValue(data)
    }
   
  }


  

  confirmClaim(data:any) {
    this.id = data.ClaimID;
    this.dialog.open(ConfirmClaimComponent ,{
     
    
      data:{ClaimID:this.id  }

    });
  }
  
  getListOfAdjustors(data:any){
    this.ClaimID = data.ClaimID
    this.cRouter.navigate(['/claims/adjustorsList',this.ClaimID])
  }


 
 
  doneIt(data:any) {
    this.id = data.ClaimID;
    this.dialog.open(DoneItComponent ,{
     
    
      data:{ClaimID:this.id}

    });
    
  }

  

  showDelete(){
    this.showMove = false;
    this.showbutton = false
   }
 
   showList(){
     this.showMove = true;
     this.showbutton = true
   }
}
