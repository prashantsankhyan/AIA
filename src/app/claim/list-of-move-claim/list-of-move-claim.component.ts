import { Component, Inject } from '@angular/core';


import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';



import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClaimNavBarComponent } from '../claim-nav-bar/claim-nav-bar.component';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AllApiService } from '../../_service/all-api.service';
import { ApiUrl } from '../../_core/apiUrl';
import { ListOfAdjusterComponent } from '../list-of-adjuster/list-of-adjuster.component';
import { ViewAdjusterFromMoveClaimComponent } from '../view-adjuster-from-move-claim/view-adjuster-from-move-claim.component';



@Component({
  selector: 'app-list-of-move-claim',
  standalone: true,
  imports: [CommonModule,MaterialModule ,SpinnerComponent,],
  templateUrl: './list-of-move-claim.component.html',
  styleUrl: './list-of-move-claim.component.scss'
})
export class ListOfMoveClaimComponent {
  showSpiner = true
  AccountID:any
  listOfMoveClaim:any =[];




  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private http:AllApiService,private router:ActivatedRoute,private cRouter:Router,public dialog: MatDialog,) { }

  ngOnInit(): void {
   
    
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.getAllData()
    
    
  }
  getAllData(){
    this.http.getAllDataId(ApiUrl.getMoveData,this.AccountID).subscribe(
      data=>{
       
        let response = JSON.stringify(data)
        let obj  = JSON.parse(response)
        this.listOfMoveClaim = obj.Claims
        this.showSpiner = false

      }
    )
  }

  viewOfAdjuster(data:any) {
    let ClaimID = data.ClaimID
    
    
    this.dialog.open(ViewAdjusterFromMoveClaimComponent ,{
      width: '1200px',
      height:'200px',
      data:{ClaimID:ClaimID}

    });
  }
  

}
