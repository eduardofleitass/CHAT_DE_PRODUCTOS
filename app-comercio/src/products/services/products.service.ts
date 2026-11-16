import type { Product } from '../interfaces/product.interface';

// Catálogo en memoria a propósito: la prueba no pide backend de catálogo.
// Para sumar un servicio alcanza con agregar un objeto a esta lista.
export const PRODUCTS: Product[] = [
  {
    id: 'sr-preventa',
    name: 'Pre venta y calificación',
    description: 'Primer contacto sobre tu base o una generada por nosotros',
    price: 890,
    currency: 'USD',
    unit: 'mes',
  },
  {
    id: 'sr-outbound',
    name: 'Venta outbound con base propia',
    description: 'Prospección y cierre con base segmentada por scoring',
    price: 1450,
    currency: 'USD',
    unit: 'mes',
  },
  {
    id: 'sr-retencion',
    name: 'Retención y fidelización',
    description: 'Gestión proactiva de cartera y clientes en riesgo',
    price: 1180,
    currency: 'USD',
    unit: 'mes',
  },
  {
    id: 'sr-cross',
    name: 'Ventas cruzadas y up selling',
    description: 'Campañas sobre la base instalada de tu empresa',
    price: 960,
    currency: 'USD',
    unit: 'mes',
  },
  {
    id: 'sr-contact',
    name: 'Contact center omnicanal',
    description: 'Atención inbound en voz, chat y redes sociales',
    price: 2100,
    currency: 'USD',
    unit: 'mes',
  },
];

export function listProducts(): Product[] {
  return PRODUCTS;
}

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}
