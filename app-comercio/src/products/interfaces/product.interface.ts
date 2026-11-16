// Lo que el comercio puede ofrecer en el chat. Para Esmassiva es un servicio, no un bien físico.
export interface Product {
  id: string; // identificador estable: viaja al pedido y no se repite en el catálogo
  name: string; // nombre comercial que ve el cliente en la tarjeta
  description?: string; // detalle corto de una línea, opcional
  price: number; // precio unitario; la API rechaza cualquier valor <= 0
  currency: string; // ISO 4217: USD, PYG, COP
  unit?: string; // a qué corresponde el precio: mes, campaña, hora
  imageUrl?: string; // logo o imagen; si falta, la tarjeta dibuja un monograma
}
