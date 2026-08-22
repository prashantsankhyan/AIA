import { Component,HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AddEditRegistrationFormComponent } from '../add-edit-registration-form/add-edit-registration-form.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-nav-registration',
  standalone: true,
  imports: [CommonModule,RouterOutlet],
  templateUrl: './nav-registration.component.html',
  styleUrl: './nav-registration.component.scss'
})
export class NavRegistrationComponent {
   loginId: any;

  // Initially hidden
  showCreateLogin = false;

  private zeroCount = 0;
  private zeroTimer: any;


  constructor(
    public dialog: MatDialog,
    private router: Router
  ) {}


  // ==========================================
  // PRESS 00 TO SHOW CREATE LOGIN BUTTON
  // ==========================================

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {

    const activeElement = document.activeElement as HTMLElement;

    // Don't trigger while typing in input fields
    if (
      activeElement?.tagName === 'INPUT' ||
      activeElement?.tagName === 'TEXTAREA' ||
      activeElement?.tagName === 'SELECT' ||
      activeElement?.isContentEditable
    ) {
      return;
    }


    if (event.key === '0') {

      this.zeroCount++;

      clearTimeout(this.zeroTimer);

      this.zeroTimer = setTimeout(() => {
        this.zeroCount = 0;
      }, 500);


      // ==========================================
      // 00 ENTERED
      // ==========================================

      if (this.zeroCount === 2) {

        this.zeroCount = 0;

        clearTimeout(this.zeroTimer);

        // Show Create New Login button
        this.showCreateLogin = true;
      }
    }
  }


  // ==========================================
  // CREATE NEW LOGIN
  // ==========================================

  openRegistrationForm(data: any): void {

    this.loginId = 0;

    const dialogRef = this.dialog.open(
      AddEditRegistrationFormComponent,
      {
        width: '500px',
        height: '400px',

        data: {
          loginId: this.loginId
        }
      }
    );
  }


  logout(): void {

    this.router.navigate(['/login']);

  }
}
