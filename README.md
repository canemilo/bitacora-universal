#  Bitácora 

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![SpringBoot](https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-0F172A?style=for-the-badge&logo=tailwindcss)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

---

#  Bitácora 

** Bitácora ** es una aplicación **full-stack** que permite crear **plantillas dinámicas** para registrar y organizar cualquier tipo de información.

La aplicación permite definir **estructuras de datos personalizadas** y registrar filas dinámicas, similar a herramientas como:

- Airtable
- Notion Databases
- Retool

pero en una versión **ligera y personalizable**.

---

#  Características

 Autenticación segura con **JWT**  
 Creación de **plantillas dinámicas**  
 Definición de **campos personalizados**  
 Registro de **filas dinámicas**  
 Dashboard moderno estilo **Apple / Figma**  
 Buscador de plantillas  
 Paginación  
 Arquitectura **frontend + backend desacoplada**

---

#  Concepto del sistema

Cada plantilla funciona como una **mini base de datos personalizable**.

Ejemplo:

## Plantilla
Coches

## Campos dinámicos
Marca
Modelo
Año
Combustible
Precio

## Filas registradas
Volkswagen | Golf | 2019 | Gasolina | 22000
Toyota | Corolla | 2021 | Híbrido | 26000
---

#  Arquitectura


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

Este proyecto fue creado como experimento de arquitectura full-stack para construir sistemas de datos dinámicos reutilizables.

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