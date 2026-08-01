import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AddEditAdjustorsComponent } from './add-edit-adjustors/add-edit-adjustors.component';
import { AllApiService } from '../../_service/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';

@Component({
  selector: 'app-adjustors',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule ,SpinnerComponent,],
  templateUrl: './adjustors.component.html',
  styleUrl: './adjustors.component.scss'
})
export class AdjustorsComponent {
 showSpiner = true
  getALLAdjustsList:any =[];
  ClaimId:any;
  confirmReason:any;
  constructor(private http:AllApiService,private router:ActivatedRoute,private cRouter:Router,public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.ClaimId = this.router.snapshot.params['ID']
    this.confirmReason = localStorage.getItem('confirmReason')
  
   this.getAllDriverList()
   
  }

  backToClaims(){
    if(this.confirmReason ==='Claim Done'){
      this.cRouter.navigate(['/claims/doneClaims'])
    }
    else{
      this.cRouter.navigate(['/claims/listOfClaims'])
    }
    
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
    
    this.dialog.open(AddEditAdjustorsComponent ,{
      width: '800px',
      
      data: {ClaimId:this.ClaimId,AdjustID:data.AdjustID,AdjustName:data.AdjustName,Business:data.Business,City:data.City,State:data.State
       , Country:data.Country ,Phone:data.Phone,Email:data.Email,Fax:data.Fax,Comments:data.Comments,EnteredBy:data.EnteredBy}

    });
    if(!!data){
      data.content?.patchValue(data)
    }
   
  }
}
