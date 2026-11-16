export interface OrderProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  status: 'created';
  createdAt: string;
  chatId: string;
  messageId: string;
  product: OrderProduct;
}
