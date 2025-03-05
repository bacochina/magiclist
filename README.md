<<<<<<< HEAD
# MagicList - Gerador de Repertórios

Uma aplicação web moderna para gerenciamento de repertórios musicais, desenvolvida com Next.js, TypeScript e Tailwind CSS.

## Funcionalidades

- 🎵 Cadastro de Bandas
  - Gerenciamento de informações básicas da banda
  - Organização por gêneros musicais
  
- 🎸 Cadastro de Músicas
  - Informações detalhadas: nome, artista, tom, BPM
  - Suporte para letras e cifras
  - Observações e notas específicas
  
- 📋 Criação de Blocos de Músicas
  - Agrupamento temático de músicas
  - Organização flexível do repertório
  - Reutilização em diferentes apresentações
  
- 📄 Gerador de Repertórios
  - Exportação em PDF e DOC
  - Personalização do layout
  - Inclusão de informações específicas do evento

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Headless UI
- Prisma (ORM)
- PostgreSQL

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- PostgreSQL (para desenvolvimento local)

## Como Iniciar

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/magiclist.git
cd magiclist
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```
Edite o arquivo `.env.local` com suas configurações

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
├── app/                    # Páginas da aplicação (Next.js App Router)
│   ├── (routes)/          # Rotas da aplicação
│   │   ├── bandas/        # Gerenciamento de bandas
│   │   ├── musicas/       # Gerenciamento de músicas
│   │   ├── blocos/        # Gerenciamento de blocos
│   │   └── repertorios/   # Geração de repertórios
│   └── layout.tsx         # Layout principal
├── components/            # Componentes React reutilizáveis
│   └── ui/               # Componentes de interface
├── lib/                  # Utilitários e configurações
│   └── types/           # Definições de tipos TypeScript
└── styles/              # Estilos globais
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

## Contato

Seu Nome - [@seutwitter](https://twitter.com/seutwitter)

Link do Projeto: [https://github.com/seu-usuario/magiclist](https://github.com/seu-usuario/magiclist)
=======
# magiclist
Gerador de Repertórios
>>>>>>> 1c0f6b5d98171b23b6c10c38b3f10aa595f70f0e
