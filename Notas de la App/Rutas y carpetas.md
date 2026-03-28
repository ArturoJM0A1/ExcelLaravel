# Rutas y carpetas

Este documento explica como esta organizado el proyecto y como se relacionan Laravel, React y Vite dentro de la aplicacion.

## Resumen rapido

Este repositorio **usa Laravel como backend y React como frontend**.

- **Laravel** maneja rutas, controladores, validaciones, servicios, modelo de datos y base de datos.
- **React** renderiza la interfaz del catalogo en el navegador.
- **Vite** compila y sirve los archivos frontend para que Laravel los cargue.
- **Vue no esta implementado en este proyecto**. No hay componentes `.vue`, ni plugin de Vue en `vite.config.js`, ni carpetas activas dedicadas a Vue.

## Estructura principal

```text
ExcelLaravel/
|-- app/
|   |-- Http/
|   |   |-- Controllers/
|   |   `-- Requests/
|   |-- Models/
|   |-- Providers/
|   |-- Rules/
|   |-- Services/
|   `-- Support/
|-- bootstrap/
|-- config/
|-- database/
|   |-- migrations/
|   `-- seeders/
|-- public/
|   `-- build/
|-- resources/
|   |-- css/
|   |-- js/
|   `-- views/
|-- routes/
|-- storage/
|-- tests/
|-- vite.config.js
|-- composer.json
`-- package.json
```

## Donde esta Laravel

Laravel vive principalmente en estas rutas:

- `app/`
- `routes/`
- `config/`
- `database/`
- `storage/`
- `bootstrap/`

### Carpetas Laravel importantes

#### `app/`

Aqui esta la logica principal del backend.

- `app/Http/Controllers/`
  Controladores que responden a las peticiones HTTP.
  Ejemplos:
  - `ProductController.php`: lista productos y actualiza productos.
  - `ProductImportController.php`: recibe el Excel, lo valida y reemplaza el catalogo.

- `app/Http/Requests/`
  Validaciones de entrada para endpoints.
  Ejemplos:
  - `ImportProductsRequest.php`: valida que el archivo sea Excel.
  - `UpdateProductRequest.php`: valida los campos al editar productos.

- `app/Models/`
  Modelos Eloquent.
  Ejemplo:
  - `Product.php`: representa la tabla de productos.

- `app/Services/`
  Servicios de negocio.
  Ejemplo:
  - `ProductSpreadsheetImporter.php`: abre el Excel, interpreta columnas y arma los productos.

- `app/Support/`
  Apoyo reutilizable del dominio.
  Ejemplo:
  - `ProductValidationRules.php`: reglas compartidas para validar productos.

- `app/Rules/`
  Reglas de validacion personalizadas de Laravel.

- `app/Providers/`
  Configuracion de servicios de la aplicacion.
  Ejemplo:
  - `AppServiceProvider.php`: aqui se ajusto el comportamiento de Vite cuando el archivo `public/hot` queda obsoleto.

#### `routes/`

Define las rutas del proyecto.

- `routes/web.php`
  Rutas web que devuelven vistas.
  En este proyecto, la ruta `/` devuelve la vista `app`.

- `routes/api.php`
  Rutas API que consume React.
  Endpoints actuales:
  - `GET /api/products`
  - `POST /api/products/import`
  - `PUT /api/products/{product}`

#### `database/`

Aqui esta la estructura y evolucion de la base de datos.

- `database/migrations/`
  Archivos que crean tablas.
  Ejemplo:
  - `2026_03_26_000003_create_products_table.php`

- `database/seeders/`
  Datos de prueba o carga inicial, si se usan.

#### `config/`

Configuracion global de Laravel: base de datos, colas, cache, sesiones, mail, etc.

#### `storage/`

Archivos generados por la aplicacion:

- logs
- cache
- sesiones
- vistas compiladas

#### `public/`

Punto de entrada publico del proyecto en el navegador.

- `public/index.php`
  Entrada principal de Laravel.

- `public/build/`
  Archivos frontend compilados por Vite para produccion o fallback.

## React

React vive principalmente en:

- `resources/js/`
- `resources/css/`
- parte de `resources/views/`

### Carpetas React importantes

#### `resources/js/`

Aqui vive el frontend de la aplicacion.

- `app.jsx`
  Punto de entrada real de React.
  Busca el elemento `#app` y monta `ProductCatalogApp`.

- `ProductCatalogApp.jsx`
  Componente principal de la interfaz.
  Aqui estan:
  - la carga del catalogo
  - la importacion del Excel
  - la edicion de productos
  - el render de cards

- `lib/productValidation.js`
  Validaciones del lado cliente para reaccion inmediata antes de enviar datos al backend.

- `app.js`
  Archivo heredado del esqueleto de Laravel.
  Solo importa `bootstrap.js`.
  **No es el punto de entrada principal actual** porque la app real usa `app.jsx`.

- `bootstrap.js`
  Configuracion base de Axios.

#### `resources/css/`

- `app.css`
  Estilos principales de la interfaz React.

#### `resources/views/`

- `app.blade.php`
  Vista Blade que sirve de puente entre Laravel y React.
  Contiene el `<div id="app"></div>` y llama a `@vite('resources/js/app.jsx')`.

- `welcome.blade.php`
  Vista heredada del proyecto base de Laravel. No es la vista principal de esta app.

## Vue no se uso

En este repositorio **Vue no esta presente como capa activa del proyecto**.

Eso significa que:

- no hay archivos `.vue`
- no existe `@vitejs/plugin-vue` en `vite.config.js`
- no hay una carpeta de componentes Vue activa
- la app del catalogo no usa Vue para renderizar la interfaz

Si en el futuro quisieras usar Vue, normalmente aparecerian rutas o archivos como estos:

- `resources/js/components/*.vue`
- `resources/js/app.js` montando `createApp(...)`
- configuracion de Vue en `vite.config.js`

Hoy, eso no existe en este proyecto.

## Como interactuan Laravel, React y Vite

La relacion entre capas funciona asi:

1. El navegador entra a `/`.
2. Laravel resuelve la ruta en `routes/web.php`.
3. Laravel devuelve la vista `resources/views/app.blade.php`.
4. Esa vista carga el bundle frontend con `@vite('resources/js/app.jsx')`.
5. React se monta dentro del `<div id="app">`.
6. `ProductCatalogApp.jsx` hace peticiones a la API de Laravel.
7. Laravel responde con JSON desde `routes/api.php` y sus controladores.
8. React actualiza la pantalla con esos datos.

## Flujo concreto de este proyecto

### 1. Entrada inicial

- Ruta: `routes/web.php`
- Vista servida: `resources/views/app.blade.php`
- Frontend montado: `resources/js/app.jsx`

### 2. Carga del catalogo

- React llama a `GET /api/products`
- Laravel llega a `ProductController@index`
- `ProductController` consulta `Product`
- Laravel devuelve JSON
- React renderiza las cards

### 3. Importacion de Excel

- React envia el archivo a `POST /api/products/import`
- Laravel valida el request con `ImportProductsRequest`
- `ProductImportController` usa `ProductSpreadsheetImporter`
- el servicio lee el Excel, valida filas y columnas
- si todo esta bien, Laravel reemplaza el catalogo en la base de datos
- React recibe la respuesta y refresca el estado visual

### 4. Edicion de productos

- React envia cambios a `PUT /api/products/{product}`
- Laravel valida con `UpdateProductRequest`
- `ProductController@update` guarda cambios en `Product`
- Laravel responde con el producto actualizado
- React actualiza solo la card modificada

## Archivos clave para entender la app

Si quieres ubicarte rapido, empieza por estos archivos:

- `routes/web.php`
- `routes/api.php`
- `resources/views/app.blade.php`
- `resources/js/app.jsx`
- `resources/js/ProductCatalogApp.jsx`
- `resources/js/lib/productValidation.js`
- `app/Http/Controllers/ProductController.php`
- `app/Http/Controllers/ProductImportController.php`
- `app/Services/ProductSpreadsheetImporter.php`
- `app/Models/Product.php`
- `database/migrations/2026_03_26_000003_create_products_table.php`
- `vite.config.js`

## Pruebas

Las pruebas automatizadas estan en:

- `tests/Feature/ProductApiTest.php`
- `tests/Feature/ExampleTest.php`
- `tests/Unit/ExampleTest.php`

## Idea del proyecto

Herramientas:

- **Laravel** sirve la aplicacion, valida datos, habla con la base de datos y expone la API.
- **React** pinta la interfaz y maneja la experiencia de usuario.
- **Vite** conecta ambas capas en desarrollo y build.

