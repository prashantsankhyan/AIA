import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenceDocumentComponent } from './expence-document.component';

const routes: Routes = [
  {
    path:'',component:ExpenceDocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenceDocumentRoutingModule { }
