import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { CHAT_ID } from '../../config/firebase';
import MessageBubble from '../components/MessageBubble';
import ProductOfferCard from '../components/ProductOfferCard';
import { listenMessages, sendProductOffer, sendTextMessage } from '../services/chat.service';
import type { ChatMessage, Product } from '../interfaces/chat-message.interface';

const DEMO_PRODUCT: Product = {
  id: 'p-101',
  name: 'Bandeja paisa',
  price: 32000,
  currency: 'COP',
  imageUrl: 'https://placehold.co/96x96/e5e7eb/111?text=BP',
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
    <main style={page}>
      <header style={header}>
        <div>
          <h1 style={title}>Comercio — chat {CHAT_ID}</h1>
          <p style={subtitle}>{messages.length} mensajes</p>
        </div>
        <button type="button" style={offerButton} onClick={handleOffer}>
          Enviar oferta
        </button>
      </header>

      <section style={list}>
        {messages.length === 0 && <p style={empty}>Todavía no hay mensajes.</p>}
        {messages.map((message) =>
          message.type === 'product_offer' ? (
            <ProductOfferCard key={message.id} message={message} />
          ) : (
            <MessageBubble key={message.id} message={message} />
          ),
        )}
        <div ref={endRef} />
      </section>

      {error && <p style={errorText}>{error}</p>}

      <form onSubmit={handleSend} style={form}>
        <input
          style={input}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Escribí un mensaje..."
        />
        <button type="submit" style={sendButton} disabled={sending}>
          Enviar
        </button>
      </form>
    </main>
  );
}

const page: CSSProperties = {
  maxWidth: 720,
  margin: '0 auto',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  boxSizing: 'border-box',
};
const header: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #d1d5db',
  paddingBottom: 8,
};
const title: CSSProperties = { margin: 0, fontSize: 20 };
const subtitle: CSSProperties = { margin: 0, fontSize: 13, color: '#6b7280' };
const offerButton: CSSProperties = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #2563eb',
  background: '#fff',
  color: '#2563eb',
  fontWeight: 600,
  cursor: 'pointer',
};
const list: CSSProperties = { flex: 1, overflowY: 'auto', padding: '16px 0' };
const empty: CSSProperties = { color: '#9ca3af', textAlign: 'center' };
const errorText: CSSProperties = { color: '#b91c1c', fontSize: 14, margin: '4px 0' };
const form: CSSProperties = { display: 'flex', gap: 8, paddingTop: 8, borderTop: '1px solid #d1d5db' };
const input: CSSProperties = {
  flex: 1,
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  fontSize: 15,
};
const sendButton: CSSProperties = {
  padding: '10px 16px',
  borderRadius: 8,
  border: 'none',
  background: '#2563eb',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
};
