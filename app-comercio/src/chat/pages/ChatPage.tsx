import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { CHAT_ID } from '../../config/firebase';
import { findProduct, listProducts } from '../../products/services/products.service';
import ProductPicker from '../../products/components/ProductPicker';
import MessageBubble from '../components/MessageBubble';
import ProductOfferCard from '../components/ProductOfferCard';
import { listenMessages, sendProductOffer, sendTextMessage } from '../services/chat.service';
import type { ChatMessage } from '../interfaces/chat-message.interface';
import '../chat.css';

const PRODUCTS = listProducts();

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sendingOffer, setSendingOffer] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // el return del efecto es la desuscripción: sin eso StrictMode deja dos listeners
  useEffect(() => listenMessages(CHAT_ID, setMessages), []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    if (!text.trim() || sending) return;

    setSending(true);
    setError('');
    try {
      await sendTextMessage(CHAT_ID, text);
      setText('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar el mensaje');
    } finally {
      setSending(false);
    }
  }

  async function handleOffer() {
    const product = findProduct(productId);
    if (!product) return;

    setSendingOffer(true);
    setError('');
    try {
      await sendProductOffer(CHAT_ID, product);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar la oferta');
    } finally {
      setSendingOffer(false);
    }
  }

  return (
    <div className="chat">
      <div className="chat__shell">
        <header className="chat__header">
          <div className="chat__identity">
            <div className="chat__avatar">E</div>
            <div>
              <h1 className="chat__title">Esmassiva</h1>
              <p className="chat__subtitle">
                chat {CHAT_ID} · {messages.length} mensajes
              </p>
            </div>
          </div>

          <div className="chat__actions">
            <ProductPicker
              products={PRODUCTS}
              value={productId}
              onChange={setProductId}
              disabled={sendingOffer}
            />

            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleOffer}
              disabled={sendingOffer}
            >
              Enviar oferta
            </button>
          </div>
        </header>

        <section className="chat__list">
          {messages.length === 0 && (
            <p className="chat__empty">
              Todavía no hay mensajes.
              <br />
              Escribí algo o mandá una oferta para arrancar.
            </p>
          )}

          {messages.map((message) =>
            message.type === 'product_offer' ? (
              <ProductOfferCard key={message.id} message={message} />
            ) : (
              <MessageBubble key={message.id} message={message} />
            ),
          )}

          <div ref={endRef} />
        </section>

        {error && <p className="chat__error">{error}</p>}

        <form className="composer" onSubmit={handleSend}>
          <input
            className="composer__input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Escribí un mensaje..."
          />
          <button type="submit" className="btn btn--primary" disabled={sending}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
