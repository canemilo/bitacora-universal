<h1 align="center">ＢＩＴÁＣＯＲＡ</h1>
<p align="center">
  <i>Build your own personal databases – no schema required.</i>
</p><p align="center">
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
</p><p align="center">
  <img src="https://img.shields.io/github/repo-size/canemilo/bitacora-universal" />
  <img src="https://img.shields.io/github/stars/canemilo/bitacora-universal" />
  <img src="https://img.shields.io/github/issues/canemilo/bitacora-universal" />
  <img src="https://img.shields.io/github/license/canemilo/bitacora-universal" />
</p>---

What’s Bitácora?

Bitácora is a full‑stack web app that lets you create custom data collections on the fly.
Think of it as your personal database builder – you define the fields you need (text, numbers, dates, etc.) and start adding records right away. No need to write SQL or design tables beforehand.

I built it because I got tired of juggling spreadsheets and wanted something more structured yet flexible – a bit like Airtable or Notion databases, but lighter and fully under my control. It’s also been a great playground for learning full‑stack development with Spring Boot and React.

---

 Features

· Create and manage multiple collections (I call them templates)
· Define custom fields per collection: text, number, date, etc.
· Add, edit, and delete records as rows
· User authentication with JWT – your data stays private
· Clean, modern UI with dark theme and glassmorphism
· RESTful API for everything

---

 How it works

A collection is just a set of fields. Once you create a collection, you can start filling in rows – each row holds values for the fields you defined.

Example:

· Collection: Cars
· Fields: Brand, Model, Year, Price
· Rows:

Brand Model Year Price
BMW M3 2022 85000
Audi RS5 2021 72000

You can use this for anything: inventory, logs, contact directories, reading lists, workout trackers – whatever comes to mind.

---

 Architecture

Bitácora follows a classic three‑tier architecture:

· Frontend: React + TypeScript (Vite, Tailwind)
· Backend: Spring Boot + Spring Security + JWT
· Database: MySQL

The frontend talks to the backend through a REST API. Authentication is handled via JWT tokens – you log in, get a token, and include it in subsequent requests.

```
User
  │
  ▼
Frontend (React)
  │
  │  REST API
  ▼
Backend (Spring Boot)
  │
  ▼
Database (MySQL)
```

---

🛠️ Tech stack

Backend

· Java 17
· Spring Boot
· Spring Security
· JWT (io.jsonwebtoken)
· Maven
· MySQL

Frontend

· React 18
· TypeScript
· Vite
· TailwindCSS
· React Router
· Axios

Infrastructure

· Docker (for MySQL)
· docker-compose

---

 Getting started

Prerequisites

· Java 17+
· Node.js 18+
· MySQL (or use the Docker container provided)
· Docker (optional, for easy MySQL setup)

Clone the repository

```bash
git clone https://github.com/canemilo/bitacora-universal.git
cd bitacora-universal
```

Database (using Docker)

```bash
docker-compose up -d mysql
```

This starts a MySQL instance on port 3306 with the default credentials (root/root). The database bitacora will be created automatically.

Backend

```bash
cd backend
./mvnw spring-boot:run
```

The API will be available at http://localhost:8080.

Frontend

```bash
cd frontend
npm install
npm run dev
```

The development server runs on http://localhost:5173.

---

 Authentication & API

The API is secured – you need to register and log in to get a JWT.

· POST /api/v1/auth/register – create a new user
· POST /api/v1/auth/login – obtain a JWT

Include the token in the Authorization header for all subsequent requests:

```
Authorization: Bearer <your-token>
```

Main endpoints

· GET /api/v1/templates – list all collections
· POST /api/v1/templates – create a new collection
· GET /api/v1/templates/{id} – get a collection with its fields and rows
· POST /api/v1/templates/{id}/fields – add a field to a collection

More endpoints for rows, updates, and deletions are available – check the source or import the Postman collection (if I ever get around to documenting it properly).

---

Project structure

```
bitacora-universal/
├── backend/                # Spring Boot application
│   ├── src/
│   └── pom.xml
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page views (Dashboard, Template, etc.)
│   │   ├── lib/            # API client, utils
│   │   └── App.tsx
│   └── package.json
├── infra/                  # Docker configs
│   └── mysql/
└── docker-compose.yml      # Spins up MySQL
```

---

About me

Hi, I’m Daniel Garrido – a student of Multiplatform Application Development (DAM) with a passion for full‑stack development, software architecture, and cybersecurity.

I started Bitácora to scratch my own itch: I wanted a tool that lets me build simple databases without the overhead of a full spreadsheet or a complex SaaS. It’s also been a fantastic way to put into practice what I’ve learned about Spring Security, JWT, React hooks, and modern frontend tooling.