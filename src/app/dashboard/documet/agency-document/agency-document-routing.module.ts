import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgencyDocumentComponent } from './agency-document.component';

const routes: Routes = [
  {
    path:'',component:AgencyDocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgencyDocumentRoutingModule { }
