import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOfLossRunComponent } from './list-of-loss-run/list-of-loss-run.component';

const routes: Routes = [
  {
    path:'',component:ListOfLossRunComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListOfLossRunRoutingModule { }
