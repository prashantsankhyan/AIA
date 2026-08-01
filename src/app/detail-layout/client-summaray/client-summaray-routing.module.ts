import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientSummarayComponent } from './client-summaray.component';

const routes: Routes = [
  {
    path:'',component:ClientSummarayComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientSummarayRoutingModule { }
