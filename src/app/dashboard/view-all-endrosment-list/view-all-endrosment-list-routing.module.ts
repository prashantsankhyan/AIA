import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewAllEndrosmentListComponent } from './view-all-endrosment-list.component';

const routes: Routes = [
  {
    path:'',component:ViewAllEndrosmentListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewAllEndrosmentListRoutingModule { }
