import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/project.model';
import { Observable, map } from 'rxjs';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

@Injectable({
  providedIn: 'root'
})
export class SitemapService {
  private readonly baseUrl = 'https://ivanreis.com.br';
  
  constructor(private http: HttpClient) {}
  
  generateSitemap(projects: Project[]): string {
    const urls: SitemapUrl[] = [
      {
        loc: this.baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 1.0
      },
      {
        loc: `${this.baseUrl}/sobre`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/projetos`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.9
      },
      {
        loc: `${this.baseUrl}/contato`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.7
      }
    ];
    
    projects.forEach(project => {
      urls.push({
        loc: `${this.baseUrl}/projetos/${project.id}`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      });
    });
    
    return this.createSitemapXml(urls);
  }
  
  private createSitemapXml(urls: SitemapUrl[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    
    urls.forEach(url => {
      xml += '<url>';
      xml += `<loc>${url.loc}</loc>`;
      xml += `<lastmod>${url.lastmod}</lastmod>`;
      xml += `<changefreq>${url.changefreq}</changefreq>`;
      xml += `<priority>${url.priority}</priority>`;
      xml += '</url>';
    });
    
    xml += '</urlset>';
    return xml;
  }
  
  generateImageSitemap(projects: Project[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';
    
    projects.forEach(project => {
      if (project.images && project.images.length > 0) {
        xml += '<url>';
        xml += `<loc>${this.baseUrl}/projetos/${project.id}</loc>`;
        xml += `<lastmod>${new Date().toISOString()}</lastmod>`;
        xml += `<changefreq>monthly</changefreq>`;
        xml += `<priority>0.8</priority>`;
        
        project.images.forEach((image, index) => {
          xml += '<image:image>';
          xml += `<image:loc>${this.baseUrl}${image}</image:loc>`;
          xml += `<image:title>${project.title} - Imagem ${index + 1}</image:title>`;
          xml += `<image:caption>${project.title} - Print do projeto</image:caption>`;
          xml += '</image:image>';
        });
        
        xml += '</url>';
      }
    });
    
    xml += '</urlset>';
    return xml;
  }
  
  saveSitemap(): Observable<string> {
    return this.http.get('/data/projects.json').pipe(
      map((response: any) => {
        const sitemap = this.generateSitemap(response.projects);
        return sitemap;
      })
    );
  }
  
  saveImageSitemap(): Observable<string> {
    return this.http.get('/data/projects.json').pipe(
      map((response: any) => {
        const sitemap = this.generateImageSitemap(response.projects);
        return sitemap;
      })
    );
  }
}