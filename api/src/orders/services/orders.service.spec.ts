import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CreateOrderDto } from '../dto/create-order.dto.js';
import { OrdersService } from './orders.service.js';

// archivo en memoria: el service escribe en process.cwd()/orders.json
const fs = vi.hoisted(() => ({ content: '[]' }));

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(async () => fs.content),
  writeFile: vi.fn(async (_path: string, content: string) => {
    fs.content = content;
  }),
}));

const dto: CreateOrderDto = {
  chatId: 'demo-1',
  messageId: '-Omsg1',
  product: { id: 'p-101', name: 'Bandeja paisa', price: 32000, currency: 'COP' },
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(() => {
    fs.content = '[]';
    service = new OrdersService();
  });

  it('crea el pedido con id, status created y createdAt', async () => {
    const order = await service.create(dto);

    expect(order.status).toBe('created');
    expect(order.id).toHaveLength(36); // uuid v4
    expect(Number.isNaN(Date.parse(order.createdAt))).toBe(false);
    expect(order.chatId).toBe('demo-1');
    expect(order.messageId).toBe('-Omsg1');
    expect(order.product.id).toBe('p-101');
  });

  it('persiste el pedido y lo devuelve por id', async () => {
    const created = await service.create(dto);

    await expect(service.findById(created.id)).resolves.toMatchObject({
      id: created.id,
      status: 'created',
    });
    expect(JSON.parse(fs.content)).toHaveLength(1);
  });

  it('acumula pedidos sin pisar los anteriores', async () => {
    const primero = await service.create(dto);
    const segundo = await service.create({ ...dto, messageId: '-Omsg2' });

    expect(JSON.parse(fs.content)).toHaveLength(2);
    await expect(service.findById(primero.id)).resolves.toBeDefined();
    await expect(service.findById(segundo.id)).resolves.toBeDefined();
  });

  it('lanza NotFoundException si el pedido no existe', async () => {
    await expect(service.findById('no-existe')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('arranca vacío cuando todavía no hay archivo (ENOENT)', async () => {
    const { readFile } = await import('node:fs/promises');
    const enoent = Object.assign(new Error('no such file'), { code: 'ENOENT' });
    vi.mocked(readFile).mockRejectedValueOnce(enoent);

    const order = await service.create(dto);
    expect(order.id).toBeDefined();
  });
});
