import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionComponent } from './transaction.component';


const routes: Routes = [
  {
    path:'', component:TransactionComponent
    
  },
  {
    path:'transactionAttachement',
    loadChildren:()=> import('./transaction-attachment/transaction-attachment.module').then(m=>m.TransactionAttachmentModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
