import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssuePolicyDetailComponent } from './issue-policy-detail.component';

const routes: Routes = [
  {
    path:'',component:IssuePolicyDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssuePolicyDetailRoutingModule { }
