import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOfClaimsAttachComponent } from './list-of-claims-attach.component';

const routes: Routes = [
  {
    path:'',component:ListOfClaimsAttachComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListOfClaimsAttachRoutingModule { }
