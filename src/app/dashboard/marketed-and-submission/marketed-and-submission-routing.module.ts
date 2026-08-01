import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketedAndSubmissionComponent } from './marketed-and-submission.component';

const routes: Routes = [
  {
    path:'',component:MarketedAndSubmissionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketedAndSubmissionRoutingModule { }
