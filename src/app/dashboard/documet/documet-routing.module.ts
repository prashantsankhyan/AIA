import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumetComponent } from './documet.component';

const routes: Routes = [
    {
    path: '',
    component: DocumetComponent,

    children: [
      {
        path: '_agency',

        loadChildren: () =>
          import('./agency-document/agency-document.module')
            .then(m => m.AgencyDocumentModule)
      },
       {
        path: '_expence',

        loadChildren: () =>
          import('./expence-document/expence-document.module')
            .then(m => m.ExpenceDocumentModule)
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumetRoutingModule { }
