import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleAttachmentListComponent } from './sale-attachment-list.component';

const routes: Routes = [
  {
    path:'',component:SaleAttachmentListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleAttachmentListRoutingModule { }
