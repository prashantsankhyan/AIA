import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EndrosementDetailsComponent } from './endrosement-details.component';
import { SubmitChangeRequestComponent } from './submit-change-request/submit-change-request.component';

const routes: Routes = [
  {
    path:'',component:EndrosementDetailsComponent
  },
  {
    path:'changeRequest',component:SubmitChangeRequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EndrosementDetailsRoutingModule { }
