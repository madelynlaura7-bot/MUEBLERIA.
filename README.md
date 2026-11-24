# CASA NATIVA — Mueblería

Catálogo web responsive y PWA de muebles. Proyecto independiente con productos en carrusel horizontal.

## Archivos
- `index.html`: estructura de la página.
- `css/styles.css`: estilos, diseño adaptable, estados de foco y metodología BEM.
- `js/app.js`: catálogo, carrusel, filtros, hidratación, carrito, validaciones, tema, bitácora y WhatsApp.
- `data/muebles.json`: 15 muebles demostrativos editables.
- `manifest.json`, `sw.js`: configuración PWA y caché offline.
- `assets/icon.svg`: icono.

## Cómo ejecutar
1. Extraer el ZIP.
2. Abrir terminal dentro de esta carpeta.
3. Ejecutar `python -m http.server 8000`.
4. Abrir `http://localhost:8000`.
5. Pulsar **Hidratar interfaz** para conectar los eventos al DOM ya renderizado. Esta acción es idempotente; usa `.off()` antes de registrar los eventos delegados con jQuery.
6. Para probar PWA/offline usar localhost o HTTPS. Las imágenes externas y Google Fonts necesitan conexión la primera vez.

## Funciones
- Carrusel horizontal con scroll-snap, desplazamiento táctil y controles anterior/siguiente.
- 15 muebles de ejemplo en salas, comedores, dormitorios, oficina y organización.
- Búsqueda, filtros y orden por precio/nombre.
- Fichas con materiales, acabados y colores.
- Carrito/selección con cantidades y total referencial en Bs.
- Formulario con validación en tiempo real y al enviar: nombre, teléfono boliviano de 8 dígitos, correo, zona, dirección y aceptación de aviso.
- Botón de WhatsApp al número de contacto indicado: 74035358 (enlace internacional +591 74035358).
- Modo claro/oscuro, menú móvil, bitácora, toasts y estados de foco.
- Hidratación manual: añade controladores al DOM existente sin volver a dibujar la interfaz. Limpieza `.off()` y delegación para evitar duplicación de listeners.
- Fetch API para JSON, imágenes con `loading="lazy"`, DOMPurify como sanitización adicional, manifest y Service Worker.

## Antes de usar con un cliente
Los muebles, fotos, precios, acabados, materiales, correo y textos son demostrativos. Sustituir por catálogo, imágenes autorizadas y datos reales. El número 74035358 se ha configurado como contacto de WhatsApp solicitado.
El formulario prepara el mensaje para que el cliente lo envíe por WhatsApp; no procesa pagos ni verifica stock. Los datos guardados en `localStorage` permanecen en ese dispositivo y no se sincronizan. Para una tienda real conectar API/backend, inventario, administración y condiciones de entrega.

## Guías de Diseño Web II aplicadas
- Separación HTML/CSS/JS y subcarpetas.
- CSS BEM y responsive; viewport, tamaños táctiles, foco visual, adaptación móvil/tablet y landscape.
- Catálogo asíncrono desde JSON con Fetch API y lazy loading.
- Event Bubbling y delegación de eventos; `.off()` antes de asignar listeners.
- Hidratación como conexión de eventos/estado al DOM existente sin redibujar.
- Validaciones dinámicas de formulario, `preventDefault()`, errores en DOM.
- PWA Offline-First: Service Worker, Cache Storage y Web App Manifest.
- DOMPurify para sanitización adicional y escape de texto en contenido del catálogo.
