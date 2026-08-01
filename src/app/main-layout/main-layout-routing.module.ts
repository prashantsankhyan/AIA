import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';

const routes: Routes = [
 
  {
   path:'',redirectTo:'account',pathMatch:'full'
  },
  {
    path:'',component:MainLayoutComponent,children:[
      {
        path:'account',
        loadChildren:()=> import('./acoount-details/acoount-details.module').then(m=>m.AcoountDetailsModule)
      },
      {
        path:'attachment',
        loadChildren:()=> import('./attachment/attachment.module').then(m=>m.AttachmentModule)
      },

     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule { }
