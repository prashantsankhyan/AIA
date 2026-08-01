import { Component,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confir-to-repeate-vehicle',
  standalone: true,
  imports: [],
  templateUrl: './confir-to-repeate-vehicle.component.html',
  styleUrl: './confir-to-repeate-vehicle.component.scss'
})
export class ConfirToRepeateVehicleComponent {

  @Output() save = new EventEmitter<void>();

}
