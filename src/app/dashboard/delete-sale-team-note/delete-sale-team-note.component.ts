import { Component, Inject } from '@angular/core';
import { AllApiService } from '../../_service/all-api.service';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiUrl } from '../../_core/apiUrl';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-delete-sale-team-note',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './delete-sale-team-note.component.html',
  styleUrl: './delete-sale-team-note.component.scss'
})
export class DeleteSaleTeamNoteComponent {
  fileID:any;
  passowrd ='';
  alertMessage:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private http:AllApiService,private router:Router,public dialog: MatDialog,private toastr: ToastrService,public dialogRef: MatDialogRef<DeleteSaleTeamNoteComponent>){
    
  }

    


  ngOnInit(){
    this.fileID = this.data.filedId
   
   

   
   
    
   
  }
 enterPassword (){
  this.passowrd;
  this.deleteNote()
 

  
 }

  deleteNote(){
    this.http.deleteByTwo(ApiUrl.confirmDeleteNote,this.fileID,this.passowrd).pipe().subscribe(data=>{
    let response = JSON.stringify(data)
    let obj  =JSON.parse(response);
    if(obj.Data.Response =='0'){
      this.alertMessage =obj.Data.ErrorMessage;
      this.toastr.error(this.alertMessage, '' ,{
        timeOut: 3000,
      });
    }
    else{
      this.alertMessage =obj.Data.ErrorMessage;
      this.toastr.success(this.alertMessage, '' ,{
        timeOut: 3000,
      });
      this.closeModel()
    }
   


    })
  }


  changeLocation() {

    // save current route first
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); // navigate to same route
    }); 
  }



  

 

  closeModel(): void {
    this.changeLocation()
    this.dialogRef.close();
   
  }





}
