export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  technologies: string[];
  images: string[];
  demoUrl?: string;
  githubUrl?: string;
  features: string[];
  iframe?: string;
}
