import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../_core/apiUrl';

@Component({
  selector: 'app-list-of-all-driver-truck-and-another',
  standalone: true,
  imports: [CommonModule,MatButtonModule,HttpClientModule],
  templateUrl: './list-of-all-driver-truck-and-another.component.html',
  styleUrl: './list-of-all-driver-truck-and-another.component.scss'
})
export class ListOfAllDriverTruckAndAnotherComponent {
  showEndrosementList = true;
  MarkedPolicyID:any;
  listOfAllData:any =[];
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private http:AllApiService,private toastr: ToastrService,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<ListOfAllDriverTruckAndAnotherComponent>){}
  ngOnInit(): void {
    this.data;
    this.MarkedPolicyID = this.data.MarkedPolicyID;
    
     this.getListOfAllData()

   }

   getListOfAllData(){
    this.http.getAllDataId(ApiUrl.getAllDetailForPolicyAndAnoter,this.MarkedPolicyID).subscribe(
      data=>{
     
        let response = JSON.stringify(data)
        let obj  = JSON.parse(response)
        this.listOfAllData = obj.servSummary;
        this.showEndrosementList = false

        // var obj  = JSON.parse(response)servSummary
        
      
  
      }
    )   
  }

  closeModel(): void {
    this.dialogRef.close();
   
  }
}
