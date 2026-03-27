# Base de datos leer

## Donde esta la base de datos

Este proyecto usa **SQLite** como base de datos local.

El archivo fisico de la base de datos esta aqui:

`database/database.sqlite`

Ruta completa en este proyecto:

`D:\Archivos AJM\Para chamba\Nexen\ExcelLaravl\database\database.sqlite`

## Como esta configurada

En el archivo `.env` la conexion activa es:

`DB_CONNECTION=sqlite`

Laravel toma esa configuracion desde `config/database.php` y, si no se define otra ruta, usa por defecto:

`database_path('database.sqlite')`

Eso significa que **no depende de MySQL ni de SQL Server** para funcionar en este proyecto actual.

## Que guarda

La tabla principal creada para la app es:

`products`

Esta tabla fue creada con migraciones y guarda estos campos:

- `id`
- `name`
- `price`
- `description`
- `quantity`
- `image_url`
- `created_at`
- `updated_at`

La migracion que crea esa tabla esta en:

`database/migrations/2026_03_26_000003_create_products_table.php`

## Importante

- Cuando importas un Excel, los productos se guardan en esta base SQLite.
- Cuando editas una card en el frontend, los cambios tambien se guardan en este mismo archivo.
- Si borras `database/database.sqlite`, perderas los datos guardados localmente.

## Si quieres revisarla

Puedes abrir el archivo `database/database.sqlite` con herramientas como:

- DB Browser for SQLite
- SQLiteStudio
- Extensiones de SQLite en VS Code

## Resumen rapido

La base de datos del proyecto esta dentro del mismo repositorio, en `database/database.sqlite`, y actualmente el sistema trabaja con **SQLite local**.
