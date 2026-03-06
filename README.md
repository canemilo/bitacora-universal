<h1 align="center">ＢＩＴÁＣＯＲＡ</h1>
<p align="center">
A dynamic data collection platform to build flexible personal databases.
</p>

<p align="center">

<img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" />
<img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
<img src="https://img.shields.io/badge/SpringSecurity-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens" />

<br>

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite" />
<img src="https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss" />

<br>

<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql" />
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker" />

</p>

<p align="center">

<img src="https://img.shields.io/github/repo-size/canemilo/bitacora-universal" />
<img src="https://img.shields.io/github/stars/canemilo/bitacora-universal" />
<img src="https://img.shields.io/github/issues/canemilo/bitacora-universal" />
<img src="https://img.shields.io/github/license/canemilo/bitacora-universal" />

</p>

#  Bitácora 

Bitácora is a full-stack application that allows users to create **dynamic data collections** to organize and manage information.

Users can define **custom data structures** by creating fields and storing records as rows. This makes it possible to build flexible personal databases for many use cases such as inventories, logs, directories, or custom trackers.

The goal of the project is to provide a **lightweight and customizable alternative** to spreadsheets or visual database tools.

---

# Features

- Create dynamic collections
- Define custom fields
- Store records as rows
- Authentication with JWT
- REST API
- Clean modern UI
- Full-stack architecture

---

# Concept

Bitácora works like a **personal database builder**.

Instead of hardcoding tables, users can create their own structure dynamically.

Example:

Collection: **Cars**

Fields:
- Brand
- Model
- Year
- Price

Rows:

| Brand | Model | Year | Price |
|------|------|------|------|
| BMW | M3 | 2022 | 85000 |
| Audi | RS5 | 2021 | 72000 |

---

# Architecture

The project follows a **full-stack architecture**:

![Architecture](https://img.shields.io/badge/architecture-full--stack-blue)
![API](https://img.shields.io/badge/API-REST-green)
![Auth](https://img.shields.io/badge/auth-JWT-orange)
User

└── Template

├── Fields

└── Rows

└── Values dinámicos

# Arquitectura del proyecto:

Frontend (React)

│

│ 
REST API

▼

Backend (Spring Boot)

│

▼

Database (MySQL)

---

#  Tecnologías

## Backend

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- REST API
- Maven
- MySQL

### Funciones principales del backend:

- autenticación JWT
- seguridad de endpoints
- gestión de plantillas
- gestión de campos dinámicos
- gestión de filas

---

## Frontend

- React
- TypeScript
- TailwindCSS
- Vite


---

#  Interfaz

## El dashboard incluye:

- panel principal de plantillas
- buscador lateral
- estadísticas rápidas
- menú de usuario
- modales para crear plantillas

## Estilo visual:

- dark theme

- glassmorphism

---

#  Estructura del proyecto

bitacora-universal
│

├── backend

│   ├── src

│   ├── pom.xml

│   └── Spring Boot API

│

├── frontend

│   ├── src

│   │   ├── components

│   │   ├── pages

│   │   ├── lib

│   │   └── App.tsx

│   └── React + Vite
│

├── infra

│   └── mysql
│

└── docker-compose.yml

## Ejecutar backend

- cd backend
- ./mvnw spring-boot:run

## Ejecutar frontend
- cd frontend
- npm install
- npm run dev

# Autenticación
- La aplicación utiliza JWT authentication.

- login → token JWT token → Authorization header

# API
## Autenticación
- POST /api/v1/auth/register
- POST /api/v1/auth/login

## Templates
- GET /api/v1/templates
- POST /api/v1/templates
- GET /api/v1/templates/{id}

## Fields
- POST /api/v1/templates/{id}/fields

![Code Style](https://img.shields.io/badge/code%20style-clean-blue)
![Code Quality](https://img.shields.io/badge/code%20quality-good-green)
![Security](https://img.shields.io/badge/security-JWT-orange)
# Objetivo del proyecto

Este proyecto empezó como una forma de experimentar con
plantillas dinámicas y bases de datos flexibles.

Inspirado en herramientas como:
•	Airtable
•	Notion
•	Retool

# Autor
Daniel Garrido

Estudiante de Desarrollo de Aplicaciones Multiplataforma (DAM).

Intereses:
•	desarrollo full-stack
•	arquitectura de software
•	automatización
•	Ciberseguridad


