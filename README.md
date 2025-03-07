# Proyecto Final

Para tener el proyecto en local, primero hay que abrir la terminal desde la ruta que se desee descargar el proyecto y colocar el siguiente comando:

- git clone https://github.com/LC2020429/TiendaWeb.git

Para poder iniciar el proyecto hay que abrir la consola dentro de la carpeta del proyecto y colocar el siguiente comando para poder instalar las dependencias:

- npm i

Este comando instalará las dependencias requeridas, luego para ejecutar el proyecto se debe ingresar el siguiente comando:

- npm run dev

> [!WARNING]
> Si no se sigue este siguiente punto no se podrá ejecutar correctamente este proyecto.

En este punto el servidor ya correrá en cierto puerto pero para poder ejecutar el programa correctamente, hay que acceder al archivo .env y extraer el dato de: "URI_MONGO"

Luego extraer la data que se encuentra en la carpeta `configs/`, y ahí se encontrarán los archivos para la base de datos.

En  la misma ruta `/configs`, se encuentra la colección de endpoints para probar el programa en Postman.

> [!CAUTION]
> Para que la documentación funcione el servidor debe estar activo/corriendo.

Para acceder a la documentación hay que escribir esta ruta en el navegador http://127.0.0.1:3005/api-docs

## Usuarios creados por defecto

El proyecto incluye los siguientes usuarios creados por defecto:

- **Admin**
  - Usuario: admin@example.com
  - Contraseña: admin123
- **Usuario Regular**
  - Usuario: user@example.com
  - Contraseña: user123

## Lógica General del Proyecto

El proyecto es una tienda web que permite a los usuarios navegar por productos, agregarlos al carrito y realizar compras. La lógica general del proyecto incluye:

- **Autenticación y Autorización**: Los usuarios pueden registrarse, iniciar sesión y acceder a diferentes funcionalidades según su rol (admin o usuario regular).
- **Gestión de Productos**: Los administradores pueden agregar, editar y eliminar productos. Los usuarios pueden ver los productos disponibles.
- **Carrito de Compras**: Los usuarios pueden agregar productos a su carrito, ver el contenido del carrito y proceder al pago.
- **Pedidos**: Los usuarios pueden realizar pedidos, y los administradores pueden gestionar estos pedidos.
- **Documentación API**: La documentación de la API está disponible en `/api-docs` y se puede acceder a ella cuando el servidor está corriendo.

