import { beforeEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted(() => ({
  push: vi.fn(async () => ({ key: '-Omsg1' })),
  update: vi.fn(async () => undefined),
  onValue: vi.fn(),
  ref: vi.fn((_database: unknown, path: string) => ({ path })),
}));

vi.mock('firebase/database', () => db);
vi.mock('../../config/firebase', () => ({ db: {}, CHAT_ID: 'demo-1' }));

import {
  listenMessages,
  sendProductOffer,
  sendTextMessage,
  updateOfferStatus,
} from './chat.service';

const product = {
  id: 'p-101',
  name: 'Bandeja paisa',
  price: 32000,
  currency: 'COP',
};

describe('chat.service (comercio)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    db.push.mockResolvedValue({ key: '-Omsg1' });
  });

  it('manda el texto como comercio con type text', async () => {
    await sendTextMessage('demo-1', '  hola  ');

    expect(db.ref).toHaveBeenCalledWith({}, 'chats/demo-1/messages');
    expect(db.push).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        sender: 'comercio',
        type: 'text',
        text: 'hola',
        createdAt: expect.any(Number),
      }),
    );
  });

  it('manda la oferta en pending con el producto y devuelve el messageId', async () => {
    const id = await sendProductOffer('demo-1', product);

    expect(id).toBe('-Omsg1');
    expect(db.push).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        sender: 'comercio',
        type: 'product_offer',
        status: 'pending',
        product,
      }),
    );
  });

  it('actualiza solo el status de la oferta', async () => {
    await updateOfferStatus('demo-1', '-Omsg1', 'accepted');

    expect(db.update).toHaveBeenCalledWith({ path: 'chats/demo-1/messages/-Omsg1' }, {
      status: 'accepted',
    });
  });

  it('el listener inyecta la key como id y ordena por createdAt', () => {
    let emitido: unknown[] = [];
    const unsubscribe = vi.fn();
    db.onValue.mockReturnValue(unsubscribe);

    const cleanup = listenMessages('demo-1', (messages) => {
      emitido = messages;
    });

    expect(db.ref).toHaveBeenCalledWith({}, 'chats/demo-1/messages');

    // simula el snapshot de Firebase: objeto indexado por key, sin campo id
    const callback = db.onValue.mock.calls[0][1] as (snapshot: unknown) => void;
    callback({
      val: () => ({
        '-Omsg2': { sender: 'comercio', type: 'text', text: 'segundo', createdAt: 2 },
        '-Omsg1': { sender: 'comercio', type: 'text', text: 'primero', createdAt: 1 },
      }),
    });

    expect(emitido.map((m) => (m as { id: string }).id)).toEqual(['-Omsg1', '-Omsg2']);
    expect(emitido.map((m) => (m as { text: string }).text)).toEqual(['primero', 'segundo']);

    // el cleanup que devuelve es el de onValue: sin esto quedan listeners pegados
    expect(cleanup).toBe(unsubscribe);
  });

  it('devuelve lista vacía cuando el chat no existe', () => {
    let emitido: unknown[] | null = null;
    db.onValue.mockReturnValue(() => {});

    listenMessages('demo-1', (messages) => {
      emitido = messages;
    });

    const callback = db.onValue.mock.calls[0][1] as (snapshot: unknown) => void;
    callback({ val: () => null });

    expect(emitido).toEqual([]);
  });
});
