import { Component } from '@angular/core';
import { DocumetNavbarComponent } from './documet-navbar/documet-navbar.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../sharingModule/material/material.module';

@Component({
  selector: 'app-documet',
  standalone: true,
  imports: [DocumetNavbarComponent,CommonModule,RouterOutlet,MaterialModule],
  templateUrl: './documet.component.html',
  styleUrl: './documet.component.scss'
})
export class DocumetComponent {

}
