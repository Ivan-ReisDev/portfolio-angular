import { Component } from '@angular/core';

@Component({
  selector: 'app-card-stacks',
  imports: [],
  templateUrl: './card-stacks.html',
  styleUrl: './card-stacks.scss',
})
export class CardStacks {
  stacks = [
    { icon: 'devicon-nestjs-original', name: 'Nest.JS' },
    { icon: 'devicon-typescript-plain', name: 'TypeScript' },
    { icon: 'devicon-javascript-plain', name: 'JavaScript' },
    { icon: 'devicon-nodejs-plain-wordmark', name: 'Node.JS' },
    { icon: 'devicon-express-original', name: 'Express.js' },
    { icon: 'devicon-angular-plain', name: 'Angular' },
    { icon: 'devicon-nextjs-plain', name: 'Next.js' },
    { icon: 'devicon-react-original', name: 'React' },
    { icon: 'devicon-python-plain', name: 'Python' },
    { icon: 'devicon-fastapi-plain', name: 'FastAPI' },
    { icon: 'devicon-dot-net-plain', name: 'Dot.Net' },
    { icon: 'devicon-tailwindcss-original', name: 'Tailwind.CSS' },
    { icon: 'devicon-mongodb-plain', name: 'Mongo.DB' },
    { icon: 'devicon-postgresql-plain', name: 'PostgreSQL' },


    // ...
  ];
}
