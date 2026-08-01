import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTransactionViewComponent } from './all-transaction-view.component';

const routes: Routes = [
  {
    path:'',component:AllTransactionViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllTransactionViewRoutingModule { }
