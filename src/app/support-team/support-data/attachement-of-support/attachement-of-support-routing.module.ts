import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttachementOfSupportComponent } from './attachement-of-support.component';

const routes: Routes = [
  {
    path:'',component:AttachementOfSupportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttachementOfSupportRoutingModule { }
