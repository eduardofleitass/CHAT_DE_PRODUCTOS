// Servicio que el comercio puede ofrecer en el chat (Esmassiva vende servicios, no bienes físicos).
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  unit?: string;
  imageUrl?: string;
}
