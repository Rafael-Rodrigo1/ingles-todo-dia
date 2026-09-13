# Inglês Todo Dia

Plataforma full-stack para aprendizado de inglês, desenvolvida com React, TypeScript, Spring Boot e PostgreSQL.

> Status: Em desenvolvimento

## Sobre o projeto

O **Inglês Todo Dia** é uma plataforma web voltada para o estudo de inglês de forma organizada e progressiva.

A aplicação reúne conteúdos de inglês, aulas, exercícios e acompanhamento de progresso do usuário em uma única plataforma.

O projeto está sendo desenvolvido como uma aplicação full-stack, com autenticação de usuários, controle de acesso, persistência de dados e integração entre frontend e backend.

## Tecnologias

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- Flyway
- Maven

### Banco de dados

- PostgreSQL

## Funcionalidades

Atualmente, o projeto possui:

- Cadastro e autenticação de usuários
- Autenticação utilizando JWT
- Controle de acesso por roles (`USER` e `ADMIN`)
- Rotas protegidas no frontend
- Gerenciamento de perfil do usuário
- Aulas organizadas por categorias
- Seções de conteúdo dentro das aulas
- Exercícios vinculados às aulas
- Questões e alternativas
- Correção de respostas
- Cálculo de pontuação dos exercícios
- Acompanhamento do progresso do usuário
- Registro do tempo de estudo
- Dashboard com informações de progresso
- Sistema de favoritos
- Estrutura para vocabulário
- Sessões de estudo
- Área administrativa protegida

## Estrutura do projeto

```text
ingles-todo-dia/
├── Back-End/
│   └── Spring Boot API
│
├── front_end/
│   └── React + TypeScript
│
├── uml/
│   └── Diagramas PlantUML
│
└── README.md
