import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-convert-value-tozero',
  standalone: true,
   imports: [CommonModule,MatButtonModule,MaterialModule ,HttpClientModule ],
  templateUrl: './convert-value-tozero.component.html',
  styleUrl: './convert-value-tozero.component.scss'
})
export class ConvertValueTozeroComponent {
  AccountID:any;
  MarkedPolicyID:any;
  messageSuccess = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<ConvertValueTozeroComponent>){
   
    }

    ngOnInit(): void {
     this.AccountID = this.data.AccountID
     this.MarkedPolicyID = this.data.MarkedPolicyID
     }


     getCovertValueToZero(){
      this.messageSuccess = false;
      this.http.getAllDataByTwoId(ApiUrl.valueToZeroInAl,this.AccountID,this.MarkedPolicyID).subscribe(
        data=>{
         
          let response  = JSON.stringify(data)
          let obj = JSON.parse(response)
          this.showSuccess()
        
    
        }
      )
    }
    showSuccess() {
      this.toastr.success('Convert To  Zero', '' ,{
        timeOut: 3000,
      });
      this.closeComponent()
    }


    closeComponent(): void {
      this.dialogRef.close();
      this.changeLocation()
    }
  
  
    changeLocation() {
  
      // save current route first
      let currentRoute = this.router.url;
      console.log("rute" , currentRoute)
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRoute]); // navigate to same route
      }); 
    }
  
  
    
  

      
}
