import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent {
 constructor(public dialog: MatDialog) { }

  
    
  

  ngOnInit(): void {
    
   
    
  }

  




   loginMarked(data:any) {
        const dialogRef = this.dialog.open(LoginComponent, {
          width: '350px',   
          height: '320px' 
        });
      }
     

}
