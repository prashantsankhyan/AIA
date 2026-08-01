import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { AllApiService } from '../../../_service/all-api.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-view-carrier-and-mg',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './view-carrier-and-mg.component.html',
  styleUrl: './view-carrier-and-mg.component.scss'
})
export class ViewCarrierAndMgComponent {

  showSpiner = true;
  listOfCarrier:any =[];
  searchText: string = '';
  ChildPolicyID:any;


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private http:AllApiService,private router:Router,public dialog: MatDialog,){
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      this.getViewOfCarrierAndMG()
    })
  }


  ngOnInit(){
  this.ChildPolicyID = this.data.ChildPolicyID;
    this.getViewOfCarrierAndMG()
  }

getViewOfCarrierAndMG() {
  

  this.http.getAllDataId(ApiUrl.getPolicyBuChildPolcyId, this.ChildPolicyID)
    .subscribe((data: any) => {
      this.showSpiner = false;

      if (data?.Response === 1) {
        this.listOfCarrier = data.ChildPolicys; // ✅ direct access
      } else {
        this.listOfCarrier = [];
      }
    });
}





}
