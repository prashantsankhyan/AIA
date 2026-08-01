import { Component } from '@angular/core';
import { SupportNavBarComponent } from './support-nav-bar/support-nav-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-support-team',
  standalone: true,
  imports: [CommonModule,SupportNavBarComponent],
  templateUrl: './support-team.component.html',
  styleUrl: './support-team.component.scss'
})
export class SupportTeamComponent {

}
