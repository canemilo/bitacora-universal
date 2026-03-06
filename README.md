#  Bitácora 

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![SpringBoot](https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-0F172A?style=for-the-badge&logo=tailwindcss)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

---

#  Bitácora 

# Bitácora

Bitácora is a full-stack application that allows users to create **dynamic data collections** to organize and manage information.

Users can define **custom data structures** by creating fields and storing records as rows. This makes it possible to build flexible personal databases for many use cases such as inventories, logs, directories, or custom trackers.

The goal of the project is to provide a **lightweight and customizable alternative** to spreadsheets or visual database tools.

---

# ✨ Features

- Create dynamic collections
- Define custom fields
- Store records as rows
- Authentication with JWT
- REST API
- Clean modern UI
- Full-stack architecture

---

# 🧠 Concept

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

# 🏗 Architecture

The project follows a **full-stack architecture**:


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