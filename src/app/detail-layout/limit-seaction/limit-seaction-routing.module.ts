import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LimitSeactionComponent } from './limit-seaction.component';

const routes: Routes = [
  {
    path:'',component:LimitSeactionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LimitSeactionRoutingModule { }
