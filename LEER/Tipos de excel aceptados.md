# Tipos de excel aceptados

## Que archivos se pueden subir

La aplicacion acepta unicamente archivos de Excel con estas extensiones:

- `.xlsx`
- `.xls`

Ademas, el archivo no debe superar los **5 MB**.

## Como debe estar configurado el Excel

Para que el sistema lo procese correctamente, el archivo debe venir asi:

- La **primera fila** debe contener los encabezados.
- Cada fila siguiente debe representar **un producto**.
- La aplicacion lee la **hoja activa** del archivo.
- Las filas completamente vacias se ignoran.

## Encabezados recomendados

La forma recomendada es usar exactamente estos nombres de columna:

- `Nombre`
- `Precio`
- `Descripcion`
- `Cantidad`
- `URL de imagen del producto`

## Encabezados alternativos que tambien reconoce el sistema

El importador tambien acepta algunas variantes:

- Para `Nombre`: `name`, `producto`, `product_name`
- Para `Precio`: `price`, `costo`, `amount`
- Para `Descripcion`: `description`, `detalle`
- Para `Cantidad`: `quantity`, `stock`, `existencia`
- Para `URL de imagen del producto`: `url_imagen`, `url_de_imagen`, `imagen_url`, `image_url`, `product_image_url`, `urlimagen`

El sistema normaliza mayusculas, minusculas, espacios y acentos en los encabezados, pero aun asi se recomienda usar los nombres oficiales para evitar confusiones.

## Como debe venir cada columna

### 1. Nombre

- Debe ser texto
- Es obligatorio
- Maximo: `160` caracteres
- No puede contener estos caracteres:
  - `'`
  - `"`
  - `´`
  - `` ` ``
  - `¨`

### 2. Precio

- Debe ser numerico
- Es obligatorio
- No puede ser negativo

El sistema puede interpretar formatos comunes como:

- `199.90`
- `$199.90`
- `MXN 199.90`
- `199,90`

### 3. Descripcion

- Debe ser texto
- Es obligatoria
- Maximo: `2000` caracteres
- No puede contener estos caracteres:
  - `'`
  - `"`
  - `´`
  - `` ` ``
  - `¨`

### 4. Cantidad

- Debe ser un numero entero
- Es obligatoria
- No puede ser negativa

Ejemplos validos:

- `0`
- `8`
- `125`

Ejemplos no validos:

- `3.5`
- `-5`
- `muchas`

### 5. URL de imagen del producto

- Debe ser texto
- Es obligatoria
- Debe ser una URL valida
- Maximo: `2048` caracteres
- No puede contener estos caracteres:
  - `'`
  - `"`
  - `´`
  - `` ` ``
  - `¨`


## Ejemplo de estructura correcta

| Nombre | Precio | Descripcion | Cantidad | URL de imagen del producto |
|---|---:|---|---:|---|
| Mouse inalambrico | 299.90 | Mouse ergonomico color azul | 15 | https://ejemplo.com/img/mouse.jpg |
| Teclado mecanico | 899.00 | Teclado compacto para oficina | 8 | https://ejemplo.com/img/teclado.jpg |

## Reglas importantes al importar

- Si falta una columna obligatoria, el archivo se rechaza.
- Si una o mas filas tienen errores, **no se importa nada**.
- El sistema muestra los errores por fila para que puedas corregirlos.
- Si el archivo es valido, el catalogo anterior se reemplaza por el nuevo.

## Recomendaciones para evitar errores

- Usa una sola tabla por hoja.
- No dejes filas de titulo arriba de los encabezados.
- No uses celdas combinadas.
- Usa URLs completas con `http://` o `https://`.
- Mantén una fila por producto.
- Usa los encabezados oficiales para reducir fallos.

## Resumen rapido

El sistema solo acepta archivos Excel `.xlsx` y `.xls`, con la primera fila como encabezado y con estas columnas minimas: `Nombre`, `Precio`, `Descripcion`, `Cantidad` y `URL de imagen del producto`.
