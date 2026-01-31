import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../models/project.model';
import { getTechIconClass } from '../../utils/tech-icons';

@Component({
  selector: 'app-project-card',
  imports: [RouterLink],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  project = input.required<Project>();
  isActive = input<boolean>(false);

  getTechIconClass = getTechIconClass;
}
