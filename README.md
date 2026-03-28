# Convierte los archivos de Excel en catálogos editables en tiempo real

Aplicacion construida con Laravel 13 + React para importar un catalogo de productos desde Excel, validar sus datos, mostrarlos en tarjetas editables y actualizar la informacion sin recargar la pagina.

<p align="center">
  <img src="https://laravel.com/img/logomark.min.svg" width="50" />
  <img src="https://www.vectorlogo.zone/logos/php/php-icon.svg" width="50" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="50" />
  <img src="https://vitejs.dev/logo.svg" width="60" />
  <img src="https://www.sqlite.org/images/sqlite370_banner.gif" width="80" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/7/73/Microsoft_Excel_2013-2019_logo.svg" width="50" />
</p>

## Aspirante

Arturo Juárez Monroy

## Video demostrativo

[![Ver video](https://img.youtube.com/vi/I7IWkHEwJ5A/0.jpg)](https://youtu.be/I7IWkHEwJ5A)

### [Dar click](https://www.youtube.com/watch?v=I7IWkHEwJ5A)

## Caracteristicas

- Carga de archivos `.xlsx` y `.xls`.
- Validacion en frontend y backend.
- Validacion de columnas obligatorias: `Nombre`, `Precio`, `Descripcion`, `Cantidad`, `URL de imagen del producto`.
- Bloqueo de caracteres no permitidos como comilla simple, comilla doble, acento agudo, backtick y dieresis.
- Render de productos en cards con imagen, nombre, precio, descripcion y cantidad.
- Edicion inmediata de productos con persistencia en base de datos.
- Pruebas automatizadas para importacion y actualizacion.

## Configuración del Backend

El sistema utiliza **Laravel 13** con **PHP 8.3**, configurado mediante archivos `.env` y el directorio `config/`.

La base de datos es **SQLite**, y además se emplean tablas para:

- `sessions`
- `cache`
- `jobs`

La estructura del proyecto es estándar, sin personalizaciones fuera de lo común.

- `GET /api/products` → Lista productos
- `POST /api/products/import` → Importa un archivo Excel
- `PUT /api/products/{product}` → Actualiza un producto

La lógica del sistema se centra en la importación de un catálogo desde Excel utilizando **PhpSpreadsheet**.

1. Se valida completamente el archivo.
2. Si existe algún error, **no se guarda ningún dato**.
3. Si todo es correcto, se **reemplaza completamente** el catálogo anterior (no se agregan registros).

La validación está correctamente estructurada mediante:

- **FormRequest**
- Reglas compartidas
- Validaciones personalizadas

La API **no cuenta con autenticación**, ya que está diseñada para funcionar como una API interna.

## Configuración del Frontend

El frontend usa **React 19** con **Vite** y se monta dentro de Laravel (no es una SPA separada).

**Entrada:** `resources/js/app.jsx`**Consumo de API:** usa directamente `/api/...`**Comunicación:** se realiza mediante `fetch`

- Carga productos al iniciar
- Permite importar archivos Excel
- Permite editar productos

Hay validación en frontend para mejorar la experiencia, pero la validación real se realiza en el backend.
Aunque **Tailwind** está instalado, la UI usa mayoritariamente CSS propio.

Algunos archivos como `axios` están presentes, pero actualmente no se utilizan. La app principal trabaja con **fetch**

## Stack

- Backend: Laravel 13
- Frontend: React 19 con Vite
- Base de datos por defecto: SQLite
- Lectura de Excel: `phpoffice/phpspreadsheet` para instalar las librerias `composer require phpoffice/phpspreadsheet`

## Instalacion

1. Instala dependencias PHP:

```bash
composer install
```

2. Instala dependencias frontend:

```bash
npm install
```

3. Copia el archivo de entorno si aun no existe:

```bash
copy .env.example .env
```

4. Genera la key de Laravel:

```bash
php artisan key:generate
```

5. Crea o configura tu base de datos. Por defecto el proyecto usa SQLite.
6. Ejecuta migraciones:

```bash
php artisan migrate
```

## Ejecucion

### En una terminal (Para el backend):

Se recomienda limpiar el cache antes de ejecutar
```bash 
php artisan optimize:clear
```

Ejecuta el Back
```bash
php artisan serve --host=127.0.0.1 --port=8000
```

### En otra terminal (Para el Frontend):

Prepara el Front para producción
```bash 
npm run build
```
Ejecuta el Front
```bash
node .\node_modules\vite\bin\vite.js --host 127.0.0.1
```

Luego abre la URL que muestre Laravel, normalmente [http://127.0.0.1:8000](http://127.0.0.1:8000).

Importante: no abras `http://localhost` sin puerto si tienes otro servicio ocupando el puerto `80`. En este proyecto la URL de desarrollo correcta es `http://127.0.0.1:8000` o `http://localhost:8000` cuando Laravel se ejecuta con `php artisan serve`.

### Tambien puedes usar un solo comando:

```bash
composer run dev
```

Ese comando ya arranca Laravel y Vite sin depender de `npm run dev`.

## Flujo de uso

1. Selecciona un archivo Excel con el formato requerido.
2. Importa el archivo.
3. Si existen errores, la interfaz mostrara el detalle por fila.
4. Si todo es valido, el catalogo se guarda y se renderiza en cards.
5. Edita cualquier producto y guarda; la UI se actualiza de inmediato.

## Endpoints de la API principales

- `GET /api/products`
- `POST /api/products/import`
- `PUT /api/products/{product}`

## Decisiones tecnicas relevantes

- Se uso Laravel como API y capa de persistencia.
- Se monto React como SPA ligera dentro de Laravel con Vite, sin necesidad de recargar la pagina para editar productos.
- La importacion reemplaza el catalogo actual solo si todo el Excel pasa validacion. Esto evita duplicados y mantiene una sola fuente de verdad.
- Las reglas de validacion de producto se centralizaron en `App\Support\ProductValidationRules`.
- La lectura del Excel se resolvio con `PhpSpreadsheet` para soportar `.xlsx` y `.xls`.
- El frontend replica validaciones clave para dar feedback inmediato, pero el backend sigue siendo la fuente final de verdad.
- Se usa como base de datos SQLite, ya que es una base de datos SQL ligera. A diferencia de sistemas grandes como MySQL o PostgreSQL, no requiere una instalación compleja ni un servidor dedicado, lo que la hace ideal para aplicaciones pequeñas, dispositivos móviles o aplicaciones de escritorio.

## Pruebas

Ejecuta la suite con:

```bash
php artisan test
```

## Build de produccion (si deseas cambiar algo)

```bash
npm run build
```

## Archivos clave

- `app/Services/ProductSpreadsheetImporter.php`
- `app/Http/Controllers/ProductImportController.php`
- `app/Http/Controllers/ProductController.php`
- `resources/js/App.jsx`
- `resources/js/lib/productValidation.js`
- `tests/Feature/ProductApiTest.php`

## Notas

- El proyecto incluye una carpeta adicional llamada "Notas de la App" por si llega haber mas dudas, ahi se explica las características fundamentales del proyecto
