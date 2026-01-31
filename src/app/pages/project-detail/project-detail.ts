import { Component, input, computed, inject, signal, HostListener, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ProjectService } from '../../core/services/project.service';
import { ImageGallery } from '../../core/components/image-gallery/image-gallery';
import { getTechIconClass } from '../../core/utils/tech-icons';
import { SEOService } from '../../core/services/seo.service';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, ImageGallery],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss'
})
export class ProjectDetail implements AfterViewInit {
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly seoService = inject(SEOService);

  // Route param bound via withComponentInputBinding
  slug = input<string>('');

  // Fallback for deep link (known Angular 19+ issue)
  readonly effectiveSlug = computed(() =>
    this.slug() || this.route.snapshot.paramMap.get('slug') || ''
  );

  readonly project = computed(() => {
    const s = this.effectiveSlug();
    return this.projectService.projects().find(p => p.id === s);
  });

  readonly projectIndex = computed(() => {
    const projects = this.projectService.projects();
    return projects.findIndex(p => p.id === this.effectiveSlug());
  });

  // Circular navigation
  readonly prevProject = computed(() => {
    const projects = this.projectService.projects();
    const idx = this.projectIndex();
    if (idx === -1 || projects.length <= 1) return null;
    const prevIdx = idx === 0 ? projects.length - 1 : idx - 1;
    return projects[prevIdx];
  });

  readonly nextProject = computed(() => {
    const projects = this.projectService.projects();
    const idx = this.projectIndex();
    if (idx === -1 || projects.length <= 1) return null;
    const nextIdx = idx === projects.length - 1 ? 0 : idx + 1;
    return projects[nextIdx];
  });

  // Demo modal state
  demoOpen = signal(false);

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.demoOpen()) {
      this.closeDemo();
    }
  }

  // Implement SEO when project is loaded
  ngAfterViewInit(): void {
    const project = this.project();
    if (project) {
      this.seoService.setProjectSEO(project);
    }
  }

  goBack(): void {
    this.router.navigate(['/'], { fragment: 'projetos' }).then(() => {
      // Ensure scroll to projects section after navigation
      setTimeout(() => {
        const projectsElement = document.getElementById('projetos');
        if (projectsElement) {
          projectsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  }

  openDemo(): void {
    this.demoOpen.set(true);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeDemo(): void {
    this.demoOpen.set(false);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  getTechIconClass = getTechIconClass;

  generateWhatsAppShareLink(): string {
    const project = this.project();
    if (!project) return '';
    
    const text = this.seoService.generateWhatsAppShareText(project);
    const url = this.seoService.generateProjectShareUrl(project.id);
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  generateLinkedInShareLink(): string {
    const project = this.project();
    if (!project) return '';
    
    const url = this.seoService.generateProjectShareUrl(project.id);
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  }
}
