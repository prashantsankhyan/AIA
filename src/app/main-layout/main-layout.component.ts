import { Component } from '@angular/core';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../sharingModule/material/material.module';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [NavBarComponent,RouterLink,MaterialModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
