import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientSummarayRoutingModule } from './client-summaray-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    
    ClientSummarayRoutingModule,
   
    GoogleMapsModule,
   
  
  ]
})
export class ClientSummarayModule { }
