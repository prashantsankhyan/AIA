import { Component } from '@angular/core';
import { CertsNavBarComponent } from './certs-nav-bar/certs-nav-bar.component';

@Component({
  selector: 'app-certs',
  standalone: true,
  imports: [CertsNavBarComponent],
  templateUrl: './certs.component.html',
  styleUrl: './certs.component.scss'
})
export class CertsComponent {

}
