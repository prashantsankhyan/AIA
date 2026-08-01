import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MgBrokerComponent } from './mg-broker.component';
import { ViewBrokerAttachmentComponent } from './view-broker-attachment/view-broker-attachment.component';

const routes: Routes = [
  {
    path:'',component:MgBrokerComponent
  },
    {
    path:'viewBroker/:id',component:ViewBrokerAttachmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MgBrokerRoutingModule { }
