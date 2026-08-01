import { Component } from '@angular/core';
import { NavBarComponent } from './nav-bar/nav-bar.component';

@Component({
  selector: 'app-detail-layout',
  standalone: true,
  imports: [NavBarComponent],
  templateUrl: './detail-layout.component.html',
  styleUrl: './detail-layout.component.scss'
})
export class DetailLayoutComponent {

}
