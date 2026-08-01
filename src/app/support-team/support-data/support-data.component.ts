import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataNavComponent } from './data-nav/data-nav.component';

@Component({
  selector: 'app-support-data',
  standalone: true,
  imports: [CommonModule,DataNavComponent],
  templateUrl: './support-data.component.html',
  styleUrl: './support-data.component.scss'
})
export class SupportDataComponent {

}
