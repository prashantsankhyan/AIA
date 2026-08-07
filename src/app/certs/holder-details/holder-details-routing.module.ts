import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolderDetailsComponent } from './holder-details.component';
import { HolderRemakrsComponent } from './holder-remakrs/holder-remakrs.component';

const routes: Routes = [
  {
    path:'',component:HolderDetailsComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolderDetailsRoutingModule { }
