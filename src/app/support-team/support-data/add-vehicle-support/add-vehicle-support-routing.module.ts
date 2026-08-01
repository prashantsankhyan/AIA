import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddVehicleSupportComponent } from './add-vehicle-support.component';

const routes: Routes = [
  {
    path:'',component:AddVehicleSupportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddVehicleSupportRoutingModule { }
