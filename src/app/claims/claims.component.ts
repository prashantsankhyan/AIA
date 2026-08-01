import { Component } from '@angular/core';
import { MainNavBarClaimsComponent } from './main-nav-bar-claims/main-nav-bar-claims.component';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [MainNavBarClaimsComponent],
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.scss'
})
export class ClaimsComponent {

}
