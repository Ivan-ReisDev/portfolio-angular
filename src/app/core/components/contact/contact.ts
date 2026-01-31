import { Component, ElementRef, AfterViewInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title } from "../typography/title/title";

@Component({
  selector: 'app-contact',
  imports: [Title],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact implements AfterViewInit {
  @ViewChild('phrase') phrase!: ElementRef;
  @ViewChild('form') form!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });

      if (this.phrase) observer.observe(this.phrase.nativeElement);
      if (this.form) observer.observe(this.form.nativeElement);
    }
  }
}
