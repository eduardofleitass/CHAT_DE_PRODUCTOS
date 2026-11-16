import type { Product } from '../interfaces/product.interface';

// Catálogo de servicios de Esmassiva. Está en memoria a propósito:
// la prueba no pide backend de catálogo, solo que la oferta lleve un producto real.
export const PRODUCTS: Product[] = [
  {
    id: 'sr-preventa', // clave estable del servicio
    name: 'Pre venta y calificación', // nombre comercial
    description: 'Primer contacto sobre tu base o una generada por nosotros', // detalle para la tarjeta
    price: 890, // precio mensual del equipo asignado
    currency: 'USD', // moneda de la propuesta
    unit: 'mes', // el precio es por mes
  },
  {
    id: 'sr-outbound', // clave estable
    name: 'Venta outbound con base propia', // nombre comercial
    description: 'Prospección y cierre con base segmentada por scoring', // detalle
    price: 1450, // precio mensual
    currency: 'USD', // moneda
    unit: 'mes', // periodicidad
  },
  {
    id: 'sr-retencion', // clave estable
    name: 'Retención y fidelización', // nombre comercial
    description: 'Gestión proactiva de cartera y clientes en riesgo', // detalle
    price: 1180, // precio mensual
    currency: 'USD', // moneda
    unit: 'mes', // periodicidad
  },
  {
    id: 'sr-cross', // clave estable
    name: 'Ventas cruzadas y up selling', // nombre comercial
    description: 'Campañas sobre la base instalada de tu empresa', // detalle
    price: 960, // precio mensual
    currency: 'USD', // moneda
    unit: 'mes', // periodicidad
  },
  {
    id: 'sr-contact', // clave estable
    name: 'Contact center omnicanal', // nombre comercial
    description: 'Atención inbound en voz, chat y redes sociales', // detalle
    price: 2100, // precio mensual
    currency: 'USD', // moneda
    unit: 'mes', // periodicidad
  },
];

// Lista completa para el selector del comercio.
export function listProducts(): Product[] {
  return PRODUCTS; // devuelve la misma referencia: el catálogo es de solo lectura
}

// Busca un servicio por id; devuelve undefined si no existe.
export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id); // comparación por clave estable
}
