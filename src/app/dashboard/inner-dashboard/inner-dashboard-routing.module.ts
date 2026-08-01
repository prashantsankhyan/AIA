import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InnerDashboardComponent } from './inner-dashboard.component';

const routes: Routes = [
  {
    path:'',component:InnerDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InnerDashboardRoutingModule { }
