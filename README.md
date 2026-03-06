# Bitácora 

Aplicación tipo “CUaderno personal” donde cada usuario puede crear **Plantillas** (categorías como “Coches”, “Ciudades”, “Restaurantes”), definir **Columnas** (campos) y añadir **Filas** (registros) de forma indefinida.

Cada fila puede tener **Logs** (historial) con **puntuación decimal 0–10**, comentario y fecha opcional.

## Tecnologías
- Java 21 (compilación) / Spring Boot 4
- Spring Web + Validation
- Spring Data JPA
- MySQL 8 (Docker)
- Flyway (migraciones)
- Spring Security + JWT

## Modelo (resumen)
- **Template**: plantilla/categoría del usuario (ej: “Mis coches”)
- **TemplateField**: columnas definidas por el usuario (ej: marca, año, combustible)
- **ObjectRow**: filas/registros (valores guardados como JSON)
- **LogEntry**: entradas de bitácora (score, comment, eventDate)

## Requisitos
- Docker + Docker Compose
- JDK 21+
- (Opcional) IntelliJ IDEA

## Arranque (dev)
### 1) Levantar MySQL
```bash
docker compose up -d
docker compose ps
