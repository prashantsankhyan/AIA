import { Component } from '@angular/core';
import { RenewListComponent } from '../../renew-list/renew-list.component';

@Component({
  selector: 'app-dashboard-renew',
  standalone: true,
  imports: [RenewListComponent],
  templateUrl: './dashboard-renew.component.html',
  styleUrl: './dashboard-renew.component.scss'
})
export class DashboardRenewComponent {

}
