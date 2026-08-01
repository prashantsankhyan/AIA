import { Component, Inject } from '@angular/core';
import { ClaimNavBarComponent } from '../claim-nav-bar/claim-nav-bar.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AllApiService } from '../../_service/all-api.service';
import { Router } from 'express';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';

@Component({
  selector: 'app-view-adjuster-from-move-claim',
  standalone: true,
  imports: [CommonModule,MaterialModule],
  templateUrl: './view-adjuster-from-move-claim.component.html',
  styleUrl: './view-adjuster-from-move-claim.component.scss'
})
export class ViewAdjusterFromMoveClaimComponent {
  showSpiner = true
  getALLAdjustsList:any =[];
  ClaimId:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private http:AllApiService,public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.getAllDriverList()
   
  }


  getAllDriverList(){
    this.data ;
    this.ClaimId = this.data.ClaimID
   
    this.http.getAllDataId(ApiUrl.getAllAdjuterByClaimId,this.ClaimId).subscribe(
      data=>{
        this.showSpiner  = false ;
        let response  = JSON.stringify(data)
        let obj = JSON.parse(response)
       this.getALLAdjustsList = obj.Adjusts

      }
    )
  }

}
