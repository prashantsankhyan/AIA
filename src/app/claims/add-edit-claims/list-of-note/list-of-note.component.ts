import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { AllApiService } from '../../../_service/all-api.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-list-of-note',
  standalone: true,
  

imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule,SpinnerComponent ],
  templateUrl: './list-of-note.component.html',
  styleUrl: './list-of-note.component.scss'
})
export class ListOfNoteComponent {
 showSpiner = true
  allNote:any =[]
  AccountID ='';
  MarkedPolicyId:any;
  EndorsementID:any;
  userPermission:any;
  ClaimID='';
 
  showMove =true; 
  showbutton = true;
  id:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private http:AllApiService,private router:ActivatedRoute,private cRouter:Router,public dialog: MatDialog,
   ) { }

  ngOnInit(): void {
    this.ClaimID = this.data.ClaimID;
    
    this.getAllData();
    
  }


 

 
  getAllData(){
    this.http.getAllDataId(ApiUrl.getClaimNoteById,this.ClaimID).subscribe(
      data=>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        let obj  = JSON.parse(response)
        this.allNote = obj.ClaimNotes

      }
    )
  }



 
  

  


 
 
 


 


  
}
