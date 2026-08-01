import { ChangeDetectorRef, Component } from '@angular/core';
import { NavRegistrationComponent } from './nav-registration/nav-registration.component';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../main-layout/nav-bar/nav-bar.component';
import { MaterialModule } from '../sharingModule/material/material.module';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { AllApiService } from '../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../_core/apiUrl';
import { AddEditRegistrationFormComponent } from './add-edit-registration-form/add-edit-registration-form.component';
import { SearchFilterPipe } from './search-filter.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [NavRegistrationComponent,CommonModule,FormsModule,MaterialModule,SpinnerComponent,SearchFilterPipe],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss'
})
export class RegistrationFormComponent {
  showSpiner = true;
 
  listOfAllLoginDetail:any =[];
  AccountID:any;
  LoginID='';
  
  searchCriteria = {
    Team: '',
    UserName: '',
    };

  
  constructor(private http:AllApiService,private router:Router,public dialog: MatDialog,private cdr: ChangeDetectorRef) { 
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      this.getAllLoginList()
    })
  }

  ngOnInit(): void {
  this.getAllLoginList();
    
  }
  updateSearchCriteria(criteria: any) {
    this.searchCriteria = { ...this.searchCriteria, ...criteria };
    this.cdr.markForCheck(); // Notify Angular that changes have occurred
  }

  // Example function to update criteria based on user input


  onTeamChange(newTeam: string) {
    this.updateSearchCriteria({ Team: newTeam });
  }

  onUserNameChange(newUserName: string) {
    this.updateSearchCriteria({ UserName: newUserName });
  }

  getAllLoginList(){
    this.http.getAllData(ApiUrl.getALlLogin).subscribe(
      data=>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        var obj  = JSON.parse(response)
        this.listOfAllLoginDetail = obj.LoginDetail ;
      }
    )   
  }

  addEditRegistrationDetail(data:any) {
    this.LoginID = data.LoginID
   
    const dialogRef = this.dialog.open(AddEditRegistrationFormComponent, {
      width: '500px',
      height: '400px',
      data: {LoginID:this.LoginID,Team:data.Team,UserName:data.UserName,Password:data.Password,EmailID:data.EmailID},
      
    });
  }


 

  
}
