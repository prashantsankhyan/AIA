import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EndrosementWorkingDataComponent } from './endrosement-working-data.component';

const routes: Routes = [
  {
    path:'',component:EndrosementWorkingDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EndrosementWorkingDataRoutingModule { }
