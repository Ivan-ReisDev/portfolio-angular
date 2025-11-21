import { Component, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/components/header/header';
import { About } from './core/components/about/about';
import { Home } from './core/components/home/home';
import { Footer } from './core/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Home, About, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  protected readonly title = signal('portfolio');
  activeSection = signal('inicio');

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.scrollContainer.nativeElement.addEventListener('scroll', () => {
      this.onScroll();
    });
  }

  onScroll() {
    const sections = ['inicio', 'sobre', 'projetos', 'educacao', 'blog', 'contato'];
    const containerRect = this.scrollContainer.nativeElement.getBoundingClientRect();
    const scrollTop = this.scrollContainer.nativeElement.scrollTop;

    let currentSection = 'inicio';
    let minDistance = Infinity;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top + scrollTop;
        const distance = Math.abs(scrollTop - relativeTop);

        if (distance < minDistance) {
          minDistance = distance;
          currentSection = section;
        }
      }
    }

    this.activeSection.set(currentSection);
  }
}
