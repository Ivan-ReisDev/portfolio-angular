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
        baseUrl: process.env['API_URL'] || 'https://q48pypbs7k3f7ke8g0ccura9.136.248.103.132.sslip.io/api'
      })
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
