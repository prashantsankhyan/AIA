import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailLayoutComponent } from './detail-layout.component';
import { LossRunListComponent } from './loss-run-list/loss-run-list.component';

const routes: Routes = [
  {
     path:'',redirectTo:'commodity',pathMatch:'full'
  },
  
  {
    path:'',component:DetailLayoutComponent,children:[
      {
       path:'commodity',
       loadChildren:()=> import('./commodity/commodity.module').then(m=>m.CommodityModule) 
      },
      {
        path:'vehicle',
        loadChildren:()=> import('./vehicle/vehicle.module').then(m=>m.VehicleModule) 
       },
       {
        path:'driver',
        loadChildren:()=> import('./driver/driver.module').then(m=>m.DriverModule) 
       },
       {
        path:'template',
        loadChildren:()=> import('./tempalte/tempalte.module').then(m=>m.TempalteModule) 
       },
       {
        path:'remarks',
        loadChildren:()=> import('./remarks/remarks.module').then(m=>m.RemarksModule) 
       },

       {
        path:'accountSummaray',
        loadChildren:()=> import('./account-summaray/account-summaray.module').then(m=>m.AccountSummarayModule) 
       },
       {
        path:'clinetSummaray',
        loadChildren:()=> import('./client-summaray/client-summaray.module').then(m=>m.ClientSummarayModule) 
       },
        {
        path:'limitSeaction',
        loadChildren:()=> import('./limit-seaction/limit-seaction.module').then(m=>m.LimitSeactionModule) 
       },
       {
        path:'listLossRun',component:LossRunListComponent
       },
       {
        path:'saleAttachement',
        loadChildren:()=> import('./sale-attachment-list/sale-attachment-list.module').then(m=>m.SaleAttachmentListModule) 
       },
       {
        path:'info',
        loadChildren:()=> import('./info/info.module').then(m=>m.InfoModule) 
       },
      
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailLayoutRoutingModule { }
