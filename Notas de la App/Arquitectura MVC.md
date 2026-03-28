\# Arquitectura MVC del Proyecto



\## ¿Cómo funciona el MVC aquí?



Este proyecto sigue el patrón \*\*MVC (Modelo - Vista - Controlador)\*\*, pero con una implementación híbrida usando Laravel y React.



\---



\## Modelo (Model)



El modelo principal es:



\- `app/Models/Product.php`



Este archivo representa un producto dentro de la tabla `products`.



\### Responsabilidades:

\- Define los campos que se pueden llenar:

&#x20; - `name`

&#x20; - `price`

&#x20; - `description`

&#x20; - `quantity`

&#x20; - `image\_url`

\- Maneja la conversión de tipos:

&#x20; - `price` → `float`

&#x20; - `quantity` → `integer`



\### En resumen:

El modelo es la capa encargada de interactuar directamente con la base de datos.



\---



\## Controlador (Controller)



Los controladores principales son:



\- `app/Http/Controllers/ProductController.php`

\- `app/Http/Controllers/ProductImportController.php`



\### Responsabilidades:

\- Recibir las peticiones HTTP

\- Decidir qué acción ejecutar

\- Coordinar la lógica de la aplicación



\### Ejemplos:



\- \*\*Obtener productos\*\*

&#x20; - Ruta: `routes/api.php`

&#x20; - Método: `ProductController@index`

&#x20; - Acción: consulta el modelo `Product` y devuelve JSON



\- \*\*Actualizar producto\*\*

&#x20; - Método: `ProductController@update`

&#x20; - Acción: valida la petición y actualiza el modelo



\- \*\*Importar desde Excel\*\*

&#x20; - Controlador: `ProductImportController`

&#x20; - Usa el servicio:

&#x20;   - `app/Services/ProductSpreadsheetImporter.php`



\### Nota:

El uso de servicios separa la lógica compleja del controlador, lo cual es una práctica común en Laravel.



\---



\## Vista (View)



La vista en este proyecto es \*\*híbrida\*\*.



\### Parte Laravel (Blade):

\- Archivo: `resources/views/app.blade.php`

\- Función:

&#x20; - Contiene un contenedor básico:

&#x20;   ```html

&#x20;   <div id="app"></div>

&#x20;   ```

&#x20; - Carga los assets mediante Vite



\### Parte React:

\- Entrada: `resources/js/app.jsx`

\- Componente principal: `resources/js/ProductCatalogApp.jsx`



\### En resumen:

Laravel solo entrega el contenedor inicial, pero la interfaz completa la renderiza React.



\---



\## Flujo completo de la aplicación



1\. El usuario abre `/`

2\. Laravel responde desde `routes/web.php`

3\. Se carga la vista `app.blade.php`

4\. React se inicializa

5\. React hace una petición a `/api/products`

6\. El controlador recibe la petición

7\. El modelo consulta la base de datos

8\. El controlador devuelve JSON

9\. React renderiza los productos en pantalla



\---



\## Conclusión



Aunque el proyecto usa MVC, la responsabilidad está dividida así:



\- \*\*Laravel\*\*:

&#x20; - Modelo

&#x20; - Controlador

&#x20; - API



\- \*\*React\*\*:

&#x20; - Vista (interfaz interactiva)



Esto convierte la arquitectura en una variante moderna de MVC donde el frontend está desacoplado del backend.



