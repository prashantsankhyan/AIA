import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../sharingModule/material/material.module';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SearchFilterPipe } from '../dashboard/search-filter.pipe';
import { AllApiService } from '../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditAppRegistrationComponent } from './add-edit-app-registration/add-edit-app-registration.component';
import { ApiUrl } from '../_core/apiUrl';

@Component({
  selector: 'app-app-registraion',
  standalone: true,
  imports: [CommonModule,FormsModule,MaterialModule],
  templateUrl: './app-registraion.component.html',
  styleUrl: './app-registraion.component.scss'
})
export class AppRegistraionComponent {
  showSpiner = true;
  listOfLoginDetail:any =[];

  constructor(private http:AllApiService,private router:Router,public dialog: MatDialog,) { 
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      this.getAllLoginList()
    })
  }
  ngOnInit(): void {
    
    this.getAllLoginList()
  
  }

  getAllLoginList(){
    this.http.getAllData(ApiUrl.getAllLoginDetail).subscribe(
      data=>{
        this.showSpiner = false
       let response = JSON.stringify(data)
       let obj  = JSON.parse(response)
       
       this.listOfLoginDetail = obj.LoginDetail
       

      }
    )
  }


  addEditAppRegistrationDetail(data:any) {
    // this.LoginID = data.LoginID
   
    const dialogRef = this.dialog.open(AddEditAppRegistrationComponent, {
      width: '500px',
      height: '400px',
      // data: {LoginID:this.LoginID,Team:data.Team,UserName:data.UserName,Password:data.Password,EmailID:data.EmailID},
      
    });
  }

}
