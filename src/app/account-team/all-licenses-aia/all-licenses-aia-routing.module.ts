import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllLicensesAiaComponent } from './all-licenses-aia.component';

const routes: Routes = [
  {
    path:'',component:AllLicensesAiaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllLicensesAiaRoutingModule { }
