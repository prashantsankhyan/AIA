import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionAttachmentComponent } from './transaction-attachment.component';

const routes: Routes = [
  {
    path:'',component:TransactionAttachmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionAttachmentRoutingModule { }
