# Respecto SQLite

- Desde Laravel 11, SQLite es el motor de base de datos predeterminado para nuevos proyectos. Es una opción excelente para desarrollo local y pruebas automatizadas
- SQLite no requiere una instalación tradicional (como instalar un servidor SQL, MySQL o PostgreSQL) porque no es un proceso de servidor independiente.

## Uso de SQLite

La aplicación utiliza **SQLite** como sistema de base de datos.

Para acceder a la base de datos, abre el archivo:

```
database.sqlite
```

### Funcionamiento

* El archivo `database.sqlite`:

  * Guarda los datos al cargar un archivo.
  * Se actualiza automáticamente al editar.
* Solo se conserva el **último archivo Excel agregado**.

### Herramienta recomendada

Puedes utilizar la extensión de Visual Studio Code:

* **SQLite Viewer** — Florian Klampfer

### Ventajas de SQLite

SQLite es una base de datos:

* Ligera
* Sin servidor
* Autocontenida en un solo archivo

Esto elimina la necesidad de instalación, configuración o administración compleja.

Es ideal para:

* Aplicaciones pequeñas
* Dispositivos móviles
* Proyectos IoT

Debido a su **portabilidad** y **mantenimiento**.

## Base de datos SQLite y migraciones en Laravel

Las **migraciones** definen la estructura de la base de datos. Funcionan como un esquema versionado que describe la creación y modificación de tablas mediante código.

* **Migraciones**: definición estructural de la base de datos
