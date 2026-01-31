import { Component, input, computed, inject, signal, HostListener, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ProjectService } from '../../core/services/project.service';
import { ImageGallery } from '../../core/components/image-gallery/image-gallery';
import { getTechIconClass } from '../../core/utils/tech-icons';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, ImageGallery],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss'
})
export class ProjectDetail {
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);

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

  goBack(): void {
    this.router.navigate(['/'], { fragment: 'projetos' });
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
}
