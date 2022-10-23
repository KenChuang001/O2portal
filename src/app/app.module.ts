import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { OCloudManagementComponent } from './o-cloud-management/o-cloud-management.component';
import { NfManagementComponent } from './nf-management/nf-management.component';
import { FaultManagementComponent } from './fault-management/fault-management.component';
import { PerformanceManagementComponent } from './performance-management/performance-management.component';
import { SoftwareManagementComponent } from './software-management/software-management.component';
import { MainComponent } from './main/main.component';
import { DxCircularGaugeModule } from 'devextreme-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OCloudInfoComponent } from './o-cloud-management/o-cloud-info/o-cloud-info.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { CommonService } from './shared/common.service';
import { AuthGuard } from './shared/auth.guard';
import { HttpErrorInterceptor } from './shared/http-error.interceptor';
import { DatePickerFormatDirective } from './shared/date-picker-format.directive';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    OCloudManagementComponent,
    NfManagementComponent,
    FaultManagementComponent,
    PerformanceManagementComponent,
    SoftwareManagementComponent,
    MainComponent,
    OCloudInfoComponent,
    DatePickerFormatDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DxCircularGaugeModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatProgressBarModule,
    NgxPaginationModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatMenuModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers: [
    AuthGuard,
    CommonService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [CommonService],
      useFactory: (commonService: CommonService) => {
        return () => commonService.loadConfig();
      }
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
