# Convierte hojas de Excel en catálogos editables en tiempo real

Aplicacion construida con Laravel 13 + React para importar un catalogo de productos desde Excel, validar sus datos, mostrarlos en tarjetas editables y actualizar la informacion sin recargar la pagina.

## Caracteristicas

- Carga de archivos `.xlsx` y `.xls`.
- Validacion en frontend y backend.
- Validacion de columnas obligatorias: `Nombre`, `Precio`, `Descripcion`, `Cantidad`, `URL de imagen del producto`.
- Bloqueo de caracteres no permitidos como comilla simple, comilla doble, acento agudo, backtick y dieresis.
- Render de productos en cards con imagen, nombre, precio, descripcion y cantidad.
- Edicion inmediata de productos con persistencia en base de datos.
- Pruebas automatizadas para importacion y actualizacion.

## Stack

- Backend: Laravel 13
- Frontend: React 19 con Vite
- Base de datos por defecto: SQLite
- Lectura de Excel: `phpoffice/phpspreadsheet`

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

En una terminal:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

En otra terminal:

```bash
node .\node_modules\vite\bin\vite.js --host 127.0.0.1
```

Luego abre la URL que muestre Laravel, normalmente [http://127.0.0.1:8000](http://127.0.0.1:8000).

Importante: no abras `http://localhost` sin puerto si tienes otro servicio ocupando el puerto `80`. En este proyecto la URL de desarrollo correcta es `http://127.0.0.1:8000` o `http://localhost:8000` cuando Laravel se ejecuta con `php artisan serve`.

Tambien puedes usar un solo comando:

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

- El proyecto ya incluye una carpeta adicional llamada LEER que explica las características fundamentales del proyecto
