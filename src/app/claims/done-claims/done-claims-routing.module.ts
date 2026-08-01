import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoneClaimsComponent } from './done-claims.component';

const routes: Routes = [
  {
    path:'',component:DoneClaimsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoneClaimsRoutingModule { }
