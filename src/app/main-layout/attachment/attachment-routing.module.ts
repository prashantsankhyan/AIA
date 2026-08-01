import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttachmentComponent } from './attachment/attachment.component';

const routes: Routes = [
  {
    path:'',component:AttachmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttachmentRoutingModule { }
