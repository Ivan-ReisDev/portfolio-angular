import { Component } from '@angular/core';

type CardStacksType = {
  icon: string;
  name: string;
  description: string;
};
@Component({
  selector: 'app-card-stacks',
  imports: [],
  templateUrl: './card-stacks.html',
  styleUrl: './card-stacks.scss',
})
export class CardStacks {
  stacks: CardStacksType[] = [
    {
      icon: 'devicon-nestjs-original',
      name: 'Nest.JS',
      description:
        'Uma estrutura Node.js progressiva para construir sistemas eficientes e confiáveis e aplicativos escaláveis do lado do servidor.',
    },
    {
      icon: 'devicon-typescript-plain',
      name: 'TypeScript',
      description:
        'TypeScript é uma linguagem de programação de código aberto desenvolvida pela Microsoft. É um superconjunto sintático estrito de JavaScript e adiciona tipagem estática opcional à linguagem.',
    },
    {
      icon: 'devicon-javascript-plain',
      name: 'JavaScript',
      description:
        'JavaScript é uma linguagem de programação interpretada estruturada, de script em alto nível com tipagem dinâmica fraca e multiparadigma. Juntamente com HTML e CSS, o JavaScript é uma das três principais tecnologias da World Wide Web.',
    },
    {
      icon: 'devicon-nodejs-plain-wordmark',
      name: 'Node.JS',
      description:
        'Node.js é um software de código aberto, multiplataforma, baseado no interpretador V8 do Google e que permite a execução de códigos JavaScript fora de um navegador web. A principal característica do Node.js é sua arquitetura assíncrona e orientada por eventos.',
    },
    {
      icon: 'devicon-express-original',
      name: 'Express.js',
      description:
        'Express.js é um framework para Node.js que fornece recursos mínimos para construção de servidores web. Foi lançado como software livre e de código aberto sob a Licença MIT. É um dos mais populares frameworks para servidores em Node.js',
    },
    {
      icon: 'devicon-angular-plain',
      name: 'Angular',
      description:
        'O Angular é um framework JavaScript open source criado para ajudar os desenvolvedores web a construir aplicativos front-end. Foi criado pela equipe do Google e é um dos frameworks de JavaScript mais populares.',
    },
    {
      icon: 'devicon-nextjs-plain',
      name: 'Next.js',
      description:
        'Next.js é uma estrutura da web de desenvolvimento front-end React de código aberto criada por Vercel que permite funcionalidades como renderização do lado do servidor e geração de sites estáticos para aplicativos da web baseados em React.',
    },
    {
      icon: 'devicon-react-original',
      name: 'React',
      description:
        'O React é uma biblioteca front-end JavaScript de código aberto com foco em criar interfaces de usuário em páginas web.',
    },
    {
      icon: 'devicon-python-plain',
      name: 'Python',
      description:
        'Python é uma linguagem de programação de alto nível, interpretada de script, imperativa, orientada a objetos, funcional, de tipagem dinâmica e forte. Foi lançada por Guido van Rossum em 1991.',
    },
    {
      icon: 'devicon-fastapi-plain',
      name: 'FastAPI',
      description:
        'O FastAPI é um framework Python focado no desenvolvimento de API’s, tem como principais características ser moderno, rápido e simples. ',
    },
    {
      icon: 'devicon-dot-net-plain',
      name: '.Net',
      description:
        '.NET é uma plataforma de aplicativos segura, confiável e de alto desempenho. C# é a linguagem de programação para o .NET. É fortemente tipado e tem simultaneidade integrada e gerenciamento automático de memória.',
    },
    {
      icon: 'devicon-tailwindcss-original',
      name: 'Tailwind.CSS',
      description:
        'Traduzido do inglês-Tailwind CSS é uma estrutura CSS de código aberto. A principal característica desta biblioteca é que, ao contrário de outros frameworks CSS como o Bootstrap, ela não fornece uma série de classes predefinidas para elementos como botões ou tabelas.',
    },
    {
      icon: 'devicon-mongodb-plain',
      name: 'Mongo.DB',
      description:
        'MongoDB é um software de banco de dados orientado a documentos livre, de código aberto e multiplataforma, escrito na linguagem C++. Classificado como um programa de banco de dados NoSQL, o MongoDB usa documentos semelhantes a JSON com esquemas.',
    },
    {
      icon: 'devicon-postgresql-plain',
      name: 'PostgreSQL',
      description:
        'PostgreSQL é um poderoso sistema de banco de dados objeto-relacional de código aberto que usa e estende a linguagem SQL combinada com muitos recursos que armazenam e dimensionam com segurança as cargas de trabalho de dados mais complicadas. ',
    },
    {
      icon: 'devicon-redis-plain',
      name: 'Redis',
      description:
        'Redis (REmote DIctionary Server) é um armazenamento de chave/valor NoSQL de código aberto, em memória, utilizado principalmente como cache de aplicação ou banco de dados de resposta rápida.',
    },
    {
      icon: 'devicon-jest-plain',
      name: 'Jest',
      description:
        'Jest é um framework de teste unitário de código aberto em JavaScript criado pelo Facebook a partir do framework Jasmine. Jest é uma das ferramentas de teste unitário mais difundidas dentro da comunidade de JavaScript.',
    },
    {
      icon: 'devicon-docker-plain',
      name: 'Docker',
      description:
        'O Docker é uma plataforma projetada para ajudar desenvolvedores a criar, compartilhar e executar aplicativos em contêiner.',
    },
    {
      icon: 'devicon-amazonwebservices-plain-wordmark',
      name: 'AWS',
      description:
        'A Amazon Web Services (AWS) é a plataforma de nuvem mais adotada e mais abrangente do mundo, oferecendo mais de 200 serviços completos de datacenters em todo o mundo.',
    },
  ];
}
