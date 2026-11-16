# products

Catálogo de servicios que el comercio puede ofrecer en el chat.

- `interfaces/product.interface.ts`: forma del servicio (id, nombre, precio, moneda, unidad).
- `services/products.service.ts`: catálogo en memoria y búsqueda por id.
- `components/ProductPicker.tsx`: selector que usa el header del chat.

Los servicios son de Esmassiva (pre venta, outbound, retención, ventas cruzadas y contact center).
Para agregar uno alcanza con sumar un objeto a `PRODUCTS`; nada más cambia.
