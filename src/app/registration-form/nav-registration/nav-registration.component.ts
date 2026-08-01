import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AddEditRegistrationFormComponent } from '../add-edit-registration-form/add-edit-registration-form.component';


@Component({
  selector: 'app-nav-registration',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './nav-registration.component.html',
  styleUrl: './nav-registration.component.scss'
})
export class NavRegistrationComponent {

  loginId:any;
  constructor(public dialog: MatDialog,private router: Router) { }


  openRegistrationForm(data:any) {
    this.loginId = 0
   
    const dialogRef = this.dialog.open(AddEditRegistrationFormComponent, {
      width: '500px',
      height: '400px',
      data: {loginId:this.loginId},
      
    });
  }

  logout(){
    this.router.navigate(['/login'])

  }

}
