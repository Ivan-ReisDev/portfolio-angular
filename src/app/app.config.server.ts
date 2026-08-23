import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { API_CONFIG } from './core/api/api.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: API_CONFIG,
      useFactory: () => ({
        baseUrl: process.env['API_URL'] || 'https://ivanreis.com.br/api'
      })
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
