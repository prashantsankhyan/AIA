import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketedComponent } from './marketed.component';
import { ShowMarketedPageOptionComponent } from './show-marketed-page-option/show-marketed-page-option.component';
import { ListOfSaleTeamAttachmentComponent } from './list-of-sale-team-attachment/list-of-sale-team-attachment.component';
import { ListOfAttachmentComponent } from './list-of-attachment/list-of-attachment.component';
import { ViewOfSaleAttachmentComponent } from './view-of-sale-attachment/view-of-sale-attachment.component';
import { authGuard } from '../auth.guard';

const routes: Routes = [
  {
    path:'',component:MarketedComponent
  },
  {
    path:'slectPageOption',component:ShowMarketedPageOptionComponent
  },
  {
    path:'listOfAttachemtAddedBySale',component:ListOfSaleTeamAttachmentComponent
  },
  {
    path:'listOfAttachment',component:ListOfAttachmentComponent
  }, 
    {
      path:'saleAttachment/:id',component:ViewOfSaleAttachmentComponent, canActivate: [authGuard]
    }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketedRoutingModule { }
