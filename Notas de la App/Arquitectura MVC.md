# MVC en el proyecto

## Modelo
- `app/Models/Product.php`
- Representa la tabla `products`
- Define campos (`name`, `price`, `description`, `quantity`, `image_url`)
- Maneja tipos (`price` → float, `quantity` → integer)

## Controlador
- `ProductController.php`
- `ProductImportController.php`
- Reciben peticiones, usan el modelo y devuelven respuestas (JSON)

Ejemplos:
- Listar productos → `index`
- Actualizar producto → `update`
- Importar Excel → usa `ProductSpreadsheetImporter`

## Vista
- Laravel: `app.blade.php` (solo monta `<div id="app">`)
- React: renderiza la interfaz (`app.jsx`, `ProductCatalogApp.jsx`)

## Flujo
1. Usuario entra a `/`
2. Laravel carga Blade
3. React inicia
4. React pide `/api/products`
5. Controlador consulta modelo
6. Devuelve JSON
7. React renderiza

## Resumen
- Laravel = modelo + controlador + API  
- React = vista


