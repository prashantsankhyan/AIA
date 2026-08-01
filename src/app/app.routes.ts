import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';

import { AlertForLoginComponent } from './alert-for-login/alert-for-login.component';
import { loginPageGardGuard } from './login-page-gard.guard';
import { LogoutComponent } from './logout/logout.component';
import { loginRedirectGuardGuard } from './login-redirect-guard.guard';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';


export const routes: Routes = [
 {
  path:'',redirectTo:'login',pathMatch:'full'
 },

 {
  path:'alertLogin',component:AlertForLoginComponent
 },
 {
  path:'logout',component:LogoutComponent,
 },
 {
  path:'login',component:LoginComponent,
 },
 
 {
  path:'mainLayout',
  loadChildren:()=> import('./main-layout/main-layout.module').then(m=>m.MainLayoutModule)
} ,

 {
  path:'welcome',component:WelcomePageComponent
} ,
{
  path:'detailLayout',
  loadChildren:()=> import('./detail-layout/detail-layout.module').then(m=>m.DetailLayoutModule)
},
{
  path:'marketed',
  loadChildren:()=> import('./marketed/marketed.module').then(m=>m.MarketedModule),canActivate:[authGuard]
}
,{
  path:'dashboard',
  loadChildren:()=> import('./dashboard/dashboard.module').then(m=>m.DashboardModule),canActivate:[authGuard]
},

{
  path:'registration',
  loadChildren:()=> import('./registration-form/registration-form.module').then(m=>m.RegistrationFormModule)
},
{
  path:'policy',
  loadChildren:()=> import('./policy/policy.module').then(m=>m.PolicyModule)
}
,
{
  path:'transaction',
  loadChildren:()=> import('./transaction/transaction.module').then(m=>m.TransactionModule)
}
,
{
  path:'claim',
  loadChildren:()=> import('./claim/claim.module').then(m=>m.ClaimModule)
},
{
  path:'appRegistration',
  loadChildren:()=> import('./app-registraion/app-registraion.module').then(m=>m.AppRegistraionModule)
},

{
  path:'lossRun',
  loadChildren:()=> import('./loss-run/loss-run.module').then(m=>m.LossRunModule)
},
{
  path:'endorsement',
  loadChildren:()=> import('./endorsement/endorsement.module').then(m=>m.EndorsementModule)
},

{
  path:'claims',
  loadChildren:()=> import('./claims/claims.module').then(m=>m.ClaimsModule)
},

{
  path:'renew',
  loadChildren:()=> import('./renew-list/renew-list.module').then(m=>m.RenewListModule)
},

{
  path:'certs',
  loadChildren:()=> import('./certs/certs.module').then(m=>m.CertsModule)
},


{
  path:'supportTeam',
  loadChildren:()=> import('./support-team/support-team.module').then(m=>m.SupportTeamModule)
},

{
  path:'accountTeam',
  loadChildren:()=> import('./account-team/account-team.module').then(m=>m.AccountTeamModule)
},
{
  path:'loginDetails',
  loadChildren:()=> import('./login-details/login-details.module').then(m=>m.LoginDetailsModule)
},

// {
//   path:'loginDetails',
//   loadChildren:()=> import('./login-details/login-details.module').then(m=>m.LoginDetailsModule)
// },

{
  path:'masterLogin',
  loadChildren:()=> import('./master-dashboard/master-dashboard.module').then(m=>m.MasterDashboardModule)
},



];


