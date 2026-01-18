import { Component, input } from '@angular/core';

/**
 * Placeholder component for project detail page.
 * Full implementation will be completed in plan 03-03.
 */
@Component({
  selector: 'app-project-detail',
  standalone: true,
  template: `
    <div class="project-detail-placeholder">
      <p>Project: {{ slug() }}</p>
      <p>Full implementation coming in plan 03-03</p>
    </div>
  `,
  styles: [`
    .project-detail-placeholder {
      padding: 2rem;
      color: #fff;
      background: #1e1e1e;
      min-height: 100vh;
    }
  `]
})
export class ProjectDetail {
  slug = input.required<string>();
}
