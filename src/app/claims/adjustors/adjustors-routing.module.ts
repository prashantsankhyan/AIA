import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdjustorsComponent } from './adjustors.component';

const routes: Routes = [
  {
    path:':ID',component:AdjustorsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdjustorsRoutingModule { }
