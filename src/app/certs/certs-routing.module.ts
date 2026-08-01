import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CertsComponent } from './certs.component';
import { CertsPdfConverterComponent } from './certs-pdf-converter/certs-pdf-converter.component';
import { ListOfCertsAttachmentComponent } from './holder-details/list-of-certs-attachment/list-of-certs-attachment.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/holder',
  //   pathMatch: 'full'
  // },
  {
    path:'',component:CertsComponent,children:[
      {
        path:'holder',
        loadChildren:()=> import('./holder-details/holder-details.module').then(m=>m.HolderDetailsModule)
      },
      {
        path:'application',component:CertsPdfConverterComponent
      },
     {
       path: 'certsAttachment/:AccountID', component: ListOfCertsAttachmentComponent
     }
    ],
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertsRoutingModule { }
