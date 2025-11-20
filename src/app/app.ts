import { Component, signal, HostListener } from '@angular/core';
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
export class App {
  protected readonly title = signal('portfolio');
  activeSection = signal('inicio');

  @HostListener('window:scroll', [])
  onScroll() {
    const sections = ['inicio', 'sobre', 'educacao', 'projetos', 'blog', 'contato'];

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 150) {
          this.activeSection.set(section);
        }
      }
    });
  }
}
