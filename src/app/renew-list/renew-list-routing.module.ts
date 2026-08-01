import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RenewListComponent } from './renew-list.component';
import { AccountDetailsForRenewComponent } from './account-details-for-renew/account-details-for-renew.component';

const routes: Routes = [
  {
    path:'',component:RenewListComponent
  } ,
  {
    path:'details/:id',component:AccountDetailsForRenewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenewListRoutingModule { }
