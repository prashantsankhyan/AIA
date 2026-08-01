import { Component } from '@angular/core';
import { NgxPrintModule } from 'ngx-print';
import { TemolateNaveComponent } from '../temolate-nave/temolate-nave.component';

@Component({
  selector: 'app-american-team-managers',
  standalone: true,
  imports: [NgxPrintModule],
  templateUrl: './american-team-managers.component.html',
  styleUrl: './american-team-managers.component.scss'
})
export class AmericanTeamManagersComponent {
email ='submissions@aiazone.com'
}
