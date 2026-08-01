import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EndrosementAttachmentComponent } from './endrosement-attachment.component';

const routes: Routes = [
  {
    path:'',component:EndrosementAttachmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EndrosementAttachmentRoutingModule { }
