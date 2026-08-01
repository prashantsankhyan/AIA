import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-data-nav',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterModule,RouterOutlet],
  templateUrl: './data-nav.component.html',
  styleUrl: './data-nav.component.scss'
})
export class DataNavComponent {

  constructor(public router: Router) {}

  driverComponent() {
    this.router.navigate(['supportTeam/suppoerData/DriverSupport']);
  }

  vehicleSupport(){
    this.router.navigate(['supportTeam/suppoerData/vehicleSupport'])
  }
 attachmentSupport(){
    this.router.navigate(['supportTeam/suppoerData/attaachementSupport'])
  }

  

}
