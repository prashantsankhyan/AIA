import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDriverForSupportComponent } from './add-driver-for-support.component';

const routes: Routes = [
  {
    path:'',component:AddDriverForSupportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddDriverForSupportRoutingModule { }
