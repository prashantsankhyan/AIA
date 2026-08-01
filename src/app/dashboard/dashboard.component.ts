import { Component } from '@angular/core';
import { NavabrComponent } from './navabr/navabr.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavabrComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
