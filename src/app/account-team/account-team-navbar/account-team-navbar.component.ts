import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../sharingModule/material/material.module';

@Component({
  selector: 'app-account-team-navbar',
  standalone: true,
  imports: [CommonModule,RouterOutlet,MaterialModule,RouterLink,RouterModule],
  templateUrl: './account-team-navbar.component.html',
  styleUrl: './account-team-navbar.component.scss'
})
export class AccountTeamNavbarComponent {

}
