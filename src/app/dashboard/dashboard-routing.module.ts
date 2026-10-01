import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { GoogleShteetComponent } from './google-shteet/google-shteet.component';
import { DashboardRenewComponent } from './dashboard-renew/dashboard-renew.component';
import { CertsHolderListComponent } from './certs-holder-list/certs-holder-list.component';

const routes: Routes = [
  {
    path:'',redirectTo:'_dashboard',pathMatch:'full'
  },
  {
    path:"",component:DashboardComponent,children:[

        {
       path:'googleSheet',component:GoogleShteetComponent
       
      },
        {
       path:'renewPolicy',component:DashboardRenewComponent
       
      },
        {
       path:'holder',component:CertsHolderListComponent
       
      },
      
      {
        path:'_dashboard',
        loadChildren:()=> import('./inner-dashboard/inner-dashboard.module').then(m=>m.InnerDashboardModule)
       
      },
      {
        path:'_carrier',
        loadChildren:()=> import('./carrier/carrier.module').then(m=>m.CarrierModule)
       
      },
      {
        path:'_broker',
        loadChildren:()=> import('./mg-broker/mg-broker.module').then(m=>m.MgBrokerModule)
       
      },
       {
        path:'_claimsData',
        loadChildren:()=> import('./claim-working-data/claim-working-data.module').then(m=>m.ClaimWorkingDataModule)
       
      },
      {
        path:'issuePolicyDetails',
        loadChildren:()=> import('./issue-policy-detail/issue-policy-detail.module').then(m=>m.IssuePolicyDetailModule)
       
      },
      {
        path:'_endrosementData',
        loadChildren:()=> import('./endrosement-working-data/endrosement-working-data.module').then(m=>m.EndrosementWorkingDataModule)
       
      },

       {
        path:'_marketd',
        loadChildren:()=> import('./marketed-and-submission/marketed-and-submission.module').then(m=>m.MarketedAndSubmissionModule)
       
      },

      
       {
        path:'_vieEndrosemenet',
        loadChildren:()=> import('./view-all-endrosment-list/view-all-endrosment-list.module').then(m=>m.ViewAllEndrosmentListModule)
       
      },

        
       {
        path:'transactionView',
        loadChildren:()=> import('./all-transaction-view/all-transaction-view.module').then(m=>m.AllTransactionViewModule)
       
      },
       {
        path:'document',
        loadChildren:()=> import('./documet/documet.module').then(m=>m.DocumetModule)
       
      },
      



      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
