import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../_core/apiUrl';

@Component({
  selector: 'app-view-remkars-policy-id',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule,],
  templateUrl: './view-remkars-policy-id.component.html',
  styleUrl: './view-remkars-policy-id.component.scss'
})
export class ViewRemkarsPolicyIdComponent {

   AccountID:any;
   ChildPolicyID:any;
    listOfRemakrs:any =[];
    constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService,
   
    public dialogRef: MatDialogRef<ViewRemkarsPolicyIdComponent>){}
  
    ngOnInit(): void {
      this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
     
      this.data;
      this.ChildPolicyID = this.data.ChildPolicyID
     
      this.getViewRemakrs();
  
     
    }


      getViewRemakrs(){
        this.http.getAllDataByTwoId(ApiUrl.remaksByPolicyId,this.AccountID,this.ChildPolicyID).subscribe(data=>{
          let respone = JSON.stringify(data)
          let obj = JSON.parse(respone)
          this.listOfRemakrs = obj.Brokers;
        
          
        })
    
      }
    formatValue(value: any): string {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  const str = value.toString().replace(/,/g, '');

  if (!isNaN(Number(str))) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(str));
  }

  return value;
}
}
