import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { CHAT_ID } from '../../config/firebase';
import MessageBubble from '../components/MessageBubble';
import ProductOfferCard from '../components/ProductOfferCard';
import { listenMessages, sendProductOffer, sendTextMessage } from '../services/chat.service';
import type { ChatMessage, Product } from '../interfaces/chat-message.interface';
import '../chat.css';

const DEMO_PRODUCT: Product = {
  id: 'p-101',
  name: 'Bandeja paisa',
  price: 32000,
  currency: 'COP',
  imageUrl: 'https://placehold.co/128x128/eef2ff/4f46e5?text=BP',
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // el return del efecto es la desuscripción que devuelve onValue
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
    setError('');
    try {
      await sendProductOffer(CHAT_ID, DEMO_PRODUCT);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar la oferta');
    }
  }

  return (
    <div className="chat">
      <div className="chat__shell">
        <header className="chat__header">
          <div className="chat__identity">
            <div className="chat__avatar">C</div>
            <div>
              <h1 className="chat__title">Comercio</h1>
              <p className="chat__subtitle">
                chat {CHAT_ID} · {messages.length} mensajes
              </p>
            </div>
          </div>

          <button type="button" className="btn btn--ghost" onClick={handleOffer}>
            Enviar oferta
          </button>
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
