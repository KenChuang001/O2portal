import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';   // 主畫面
import { OCloudManagementComponent } from './o-cloud-management/o-cloud-management.component';    // O-Cloud管理
import { OCloudInfoComponent } from './o-cloud-management/o-cloud-info/o-cloud-info.component';
import { NfManagementComponent } from './nf-management/nf-management.component';      // NF管理
import { FaultManagementComponent } from './fault-management/fault-management.component';   // 故障管理
import { PerformanceManagementComponent } from './performance-management/performance-management.component';   // 效能管理
import { SoftwareManagementComponent } from './software-management/software-management.component';      // 軟體管理
import { AuthGuard } from './shared/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'main', component: MainComponent, canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'o-cloud-mgr',
        children: [
          { path: '', component: OCloudManagementComponent },
          { path: 'info/:cloudId', component: OCloudInfoComponent }
        ]
      },
      { path: 'nf-mgr', component: NfManagementComponent },
      { path: 'fault-mgr', component: FaultManagementComponent },
      { path: 'performance-mgr', component: PerformanceManagementComponent },
      { path: 'software-mgr', component: SoftwareManagementComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
