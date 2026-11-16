import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateOrderDto } from '../dto/create-order.dto.js';
import type { Order } from '../interfaces/order.interface.js';

const ORDERS_FILE = join(process.cwd(), 'orders.json');

@Injectable()
export class OrdersService {
  async create(dto: CreateOrderDto): Promise<Order> {
    const order: Order = {
      id: randomUUID(),
      status: 'created',
      createdAt: new Date().toISOString(),
      chatId: dto.chatId,
      messageId: dto.messageId,
      product: dto.product,
    };

    const orders = await this.readAll();
    orders.push(order);
    await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');

    return order;
  }

  async findById(id: string): Promise<Order> {
    const order = (await this.readAll()).find((o) => o.id === id);

    if (!order) {
      throw new NotFoundException(`No existe un pedido con id ${id}`);
    }

    return order;
  }

  private async readAll(): Promise<Order[]> {
    try {
      return JSON.parse(await readFile(ORDERS_FILE, 'utf8')) as Order[];
    } catch (error) {
      // primer arranque: todavía no hay archivo
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw error;
    }
  }
}
