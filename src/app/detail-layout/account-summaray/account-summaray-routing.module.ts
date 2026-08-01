import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountSummarayComponent } from './account-summaray.component';

const routes: Routes = [
  {
    path:'',component:AccountSummarayComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountSummarayRoutingModule { }
