const TECH_ICON_MAP: Record<string, string> = {
  'CSS': 'devicon-css3-plain',
  'HTML': 'devicon-html5-plain',
  'PHP': 'devicon-php-plain',
  'SEO On-page': 'fa-solid fa-search',
  'SEO': 'fa-solid fa-search',
  'Angular': 'devicon-angularjs-plain',
  'Angular SSR': 'devicon-angularjs-plain',
  'React': 'devicon-react-original',
  'Next.js': 'devicon-nextjs-plain',
  'NestJS': 'devicon-nestjs-original',
  'Node.js': 'devicon-nodejs-plain',
  'TypeScript': 'devicon-typescript-plain',
  'JavaScript': 'devicon-javascript-plain',
  'Python': 'devicon-python-plain',
  'Docker': 'devicon-docker-plain',
  'MongoDB': 'devicon-mongodb-plain',
  'PostgreSQL': 'devicon-postgresql-plain',
  'Redis': 'devicon-redis-plain',
  'Firebase': 'devicon-firebase-plain',
  'Tailwind CSS': 'devicon-tailwindcss-original',
  'SCSS': 'devicon-sass-original',
  'Sass': 'devicon-sass-original',
  'Git': 'devicon-git-plain',
  'Express': 'devicon-express-original',
  'FastAPI': 'devicon-fastapi-plain',
  'Stripe': 'fa-brands fa-stripe',
  'Jest': 'devicon-jest-plain',
  'Swagger': 'fa-solid fa-file-code',
  'OpenAPI': 'fa-solid fa-file-code',
  'RabbitMQ': 'devicon-rabbitmq-original',
  'BullMQ': 'fas fa-layer-group',
  'D3.js': 'devicon-d3js-plain',
  'Chart.js': 'fa-solid fa-chart-line',
  'WebSocket': 'fa-solid fa-plug',
  'Ionic': 'devicon-ionic-original',
  'Capacitor': 'fa-solid fa-mobile-alt',
  'LangChain': 'fa-solid fa-link',
  'OpenAI': 'fa-solid fa-brain',
  'OpenAI API': 'fa-solid fa-brain',
  'Vercel': 'devicon-vercel-original',
};

export function getTechIconClass(tech: string): string {
  if (TECH_ICON_MAP[tech]) {
    return TECH_ICON_MAP[tech];
  }
  const normalized = tech.toLowerCase().replace(/\./g, '').replace(/\s/g, '');
  return `devicon-${normalized}-plain`;
}
