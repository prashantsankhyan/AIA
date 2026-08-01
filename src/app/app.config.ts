import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { CloseWindowService } from './_service/close-window.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes,withHashLocation())  ,provideClientHydration() , provideAnimationsAsync(),provideHttpClient(withFetch()), provideToastr(),CloseWindowService,]
  
};
