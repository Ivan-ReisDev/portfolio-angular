import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { SEOService } from '../services/seo.service';

@Injectable()
export class SEOInterceptor implements HttpInterceptor {
  constructor(private seoService: SEOService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req);
  }
}