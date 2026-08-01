import { Component } from '@angular/core';
import { ClaimNavBarComponent } from './claim-nav-bar/claim-nav-bar.component';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../sharingModule/material/material.module';
import { SpinnerComponent } from '../spinner/spinner.component';
import { AllApiService } from '../_service/all-api.service';
import { ApiUrl } from '../_core/apiUrl';

import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddEditClaimComponent } from './add-edit-claim/add-edit-claim.component';
import { QaClaimComponent } from './qa-claim/qa-claim.component';
import { MoveClaimComponent } from './move-claim/move-claim.component';


@Component({
  selector: 'app-claim',
  standalone: true,
  imports: [ClaimNavBarComponent ,CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule ,SpinnerComponent,],
  templateUrl: './claim.component.html',
  styleUrl: './claim.component.scss'
})
export class ClaimComponent {
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
  constructor(private http:AllApiService,private router:ActivatedRoute,private cRouter:Router,public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.userPermission = localStorage.getItem('userPermissiondetail')
    
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.getAllData();
    
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


  


 
 
  // moveToClaima(data:any) {
  //   this.id = data.ClaimID;
  //   this.dialog.open(MoveClaimComponent ,{
  //     width: '450px',
  //     height:'300px',
  //     data:{ClaimID:this.id  }

  //   });
    
  // }




  addEditClaim(data?:any) {
    this.dialog.open(AddEditClaimComponent ,{
      width: '1300px',
      height:'900px',
      data: {ClaimID:data.ClaimID }

    });
    if(!!data){
      data.content?.patchValue(data)
    }
   
  }


  addSuccessFully(data:any) {
    this.id = data.ClaimID;
    this.dialog.open(QaClaimComponent ,{
      width: '450px',
      height:'200px',
      data:{ClaimID:this.id  }

    });
  }
  
  getListOfAdjustors(data:any){
    this.ClaimID = data.ClaimID
    this.cRouter.navigate(['claim/adjuster',this.ClaimID])
  }


 
 
  moveToClaima(data:any) {
    this.id = data.ClaimID;
    this.dialog.open(MoveClaimComponent ,{
      width: '450px',
      height:'300px',
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
