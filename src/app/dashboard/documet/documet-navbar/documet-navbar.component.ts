import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-documet-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink,
    RouterLinkActive,
    RouterOutlet],
  templateUrl: './documet-navbar.component.html',
  styleUrl: './documet-navbar.component.scss'
})
export class DocumetNavbarComponent {

}
