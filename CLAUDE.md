# CLAUDE.md

## Sobre o projeto

**clone-tabnews-ia**: implementação do [tabnews.com.br](https://www.tabnews.com.br) para o [curso.dev](https://curso.dev), construída com agentes de IA.

O clone do TabNews está no início: hoje o repositório contém só a base Next.js e uma página inicial com o texto "Clone Tabnews".

## Stack

- Next.js 16.2.12 (App Router, diretório `app/`)
- React 19.3.1
- JavaScript puro (sem TypeScript), CSS global em `app/globals.css`
- Sem banco de dados, testes ou linter configurados ainda

## Comandos

```bash
npm install
npm run dev     # servidor de desenvolvimento (porta 3000)
npm run build
npm run start
```

## Estrutura

- `app/layout.js`: layout raiz
- `app/page.js`: página inicial
- `app/globals.css`: estilos globais mínimos

## Convenções

- Idioma: interface, comentários e mensagens de commit em português (pt-BR)
- Ambiente: GitHub Codespaces
