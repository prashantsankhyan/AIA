import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../../sharingModule/material/material.module';

@Component({
  selector: 'app-temolate-nave',
  standalone: true,
  imports: [RouterOutlet,RouterModule,RouterLink,MaterialModule],
  templateUrl: './temolate-nave.component.html',
  styleUrl: './temolate-nave.component.scss'
})
export class TemolateNaveComponent {




}
