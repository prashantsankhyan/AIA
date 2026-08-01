import { Component } from '@angular/core';


import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';


import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClaimNavBarComponent } from '../claim-nav-bar/claim-nav-bar.component';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AddEditAdjunsterComponent } from '../add-edit-adjunster/add-edit-adjunster.component';
import { ApiUrl } from '../../_core/apiUrl';
import { AllApiService } from '../../_service/all-api.service';


@Component({
  selector: 'app-list-of-adjuster',
  standalone: true,
  imports: [ClaimNavBarComponent ,CommonModule,MaterialModule,ReactiveFormsModule,FormsModule ,SpinnerComponent,],
  templateUrl: './list-of-adjuster.component.html',
  styleUrl: './list-of-adjuster.component.scss'
})
export class ListOfAdjusterComponent {
  showSpiner = true
  getALLAdjustsList:any =[];
  ClaimId:any;
  constructor(private http:AllApiService,private router:ActivatedRoute,private cRouter:Router,public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.ClaimId = this.router.snapshot.params['ID']
   this.getAllDriverList()
   
  }


  getAllDriverList(){
    this.http.getAllDataId(ApiUrl.getAllAdjuterByClaimId,this.ClaimId).subscribe(
      data=>{
        this.showSpiner  = false ;
        let response  = JSON.stringify(data)
        let obj = JSON.parse(response)
       this.getALLAdjustsList = obj.Adjusts

      }
    )
  }



  addEditAdjustor(data?:any) {
    
    this.dialog.open(AddEditAdjunsterComponent ,{
      width: '800px',
      height:'450px',
      data: {ClaimId:this.ClaimId,AdjustID:data.AdjustID,AdjustName:data.AdjustName,Business:data.Business,City:data.City,State:data.State
       , Country:data.Country ,Phone:data.Phone,Email:data.Email,Fax:data.Fax,Comments:data.Comments,EnteredBy:data.EnteredBy}

    });
    if(!!data){
      data.content?.patchValue(data)
    }
   
  }
}
