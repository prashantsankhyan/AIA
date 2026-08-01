import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimWorkingDataComponent } from './claim-working-data.component';

const routes: Routes = [
  {
    path:'',component:ClaimWorkingDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimWorkingDataRoutingModule { }
