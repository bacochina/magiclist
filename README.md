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

- Next.js 14 (Framework React)
- TypeScript
- Tailwind CSS (Estilização)
- Supabase (Banco de dados e Autenticação)
- Shadcn/ui (Componentes)
- React Hook Form (Formulários)
- Zod (Validação)
- SweetAlert2 (Alertas)
- Sonner (Toasts)
- Lucide React (Ícones)

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

## SweetAlert2

O projeto utiliza a biblioteca SweetAlert2 para exibir alertas, confirmações e diálogos de forma elegante e responsiva.

### Instalação

A biblioteca já está instalada no projeto. Caso precise reinstalá-la:

```bash
npm install sweetalert2
```

### Importação dos Estilos

Os estilos do SweetAlert2 são importados globalmente em `src/app/layout.tsx`:

```typescript
import 'sweetalert2/dist/sweetalert2.min.css'
```

### Utilitários Disponíveis

O projeto oferece vários utilitários para facilitar o uso do SweetAlert2, localizados em `src/lib/sweetalert.ts`:

#### Alertas Simples (Toast)

```typescript
import { alertaSucesso, alertaErro, alertaInfo, alertaAviso } from '@/lib/sweetalert';

// Exemplos de uso
alertaSucesso('Operação realizada com sucesso!');
alertaErro('Ocorreu um erro na operação!');
alertaInfo('Esta é uma informação importante.');
alertaAviso('Atenção! Esta ação requer cuidado.');
```

#### Confirmações

```typescript
import { confirmar } from '@/lib/sweetalert';

// Exemplo de uso
const handleExcluirItem = async (id: string) => {
  const confirmado = await confirmar(
    'Excluir item',
    'Tem certeza que deseja excluir este item?',
    'warning'
  );
  
  if (confirmado) {
    // Prosseguir com a exclusão
  }
};
```

#### Alerta Padrão

```typescript
import { alerta } from '@/lib/sweetalert';

// Exemplo de uso
alerta('Título', 'Esta é uma mensagem de alerta padrão.', 'info');
```

#### Alerta com HTML

```typescript
import { alertaHTML } from '@/lib/sweetalert';

// Exemplo de uso
alertaHTML(
  'Alerta com HTML', 
  '<b>HTML</b> formatado com <i>estilos</i> e <u>elementos</u>', 
  'info'
);
```

#### Input de Texto

```typescript
import { inputTexto } from '@/lib/sweetalert';

// Exemplo de uso
const texto = await inputTexto(
  'Digite um valor',
  'Insira seu texto abaixo:',
  'Digite aqui...'
);
if (texto) {
  // Fazer algo com o texto digitado
}
```

#### Alerta Temporizado

```typescript
import { alertaComTempo } from '@/lib/sweetalert';

// Exemplo de uso - fecha após 3 segundos
alertaComTempo(
  'Alerta Temporizado',
  'Este alerta fechará automaticamente em 3 segundos',
  'info',
  3000
);
```

#### Uso Avançado

Para casos mais específicos, você pode importar o Swal diretamente:

```typescript
import Swal from '@/lib/sweetalert';

// Exemplo de uso avançado
Swal.fire({
  title: 'Título personalizado',
  text: 'Mensagem personalizada',
  icon: 'success',
  showCancelButton: true,
  confirmButtonText: 'Sim',
  cancelButtonText: 'Não',
  // ... outras opções
});
```

### Documentação Completa

Para mais informações, consulte a [documentação oficial do SweetAlert2](https://sweetalert2.github.io/).

## Iniciando o Projeto

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Iniciar em modo de produção
npm start
```
