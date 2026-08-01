import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarrierComponent } from './carrier.component';
import { ViewCarrierAttachmentComponent } from './view-carrier-attachment/view-carrier-attachment.component';

const routes: Routes = [
  {
    path:'',component:CarrierComponent
  },
 {
  path: 'carrierAttachment/:id',
  component: ViewCarrierAttachmentComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarrierRoutingModule { }
