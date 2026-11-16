import { useEffect, useRef, useState } from 'react'; // hooks de React
import type { FormEvent } from 'react'; // tipo del evento del formulario
import { CHAT_ID } from '../../config/firebase'; // chat compartido por las tres piezas
import { findProduct, listProducts } from '../../products/services/products.service'; // catálogo de servicios
import ProductPicker from '../../products/components/ProductPicker'; // selector del servicio
import MessageBubble from '../components/MessageBubble'; // burbuja de texto
import ProductOfferCard from '../components/ProductOfferCard'; // tarjeta de oferta
import { listenMessages, sendProductOffer, sendTextMessage } from '../services/chat.service'; // acceso a Firebase
import type { ChatMessage } from '../interfaces/chat-message.interface'; // forma de cada mensaje
import '../chat.css'; // estilos del chat

const PRODUCTS = listProducts(); // catálogo leído una sola vez

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]); // mensajes que llegan de Firebase
  const [text, setText] = useState(''); // lo que se está escribiendo
  const [productId, setProductId] = useState(PRODUCTS[0].id); // servicio elegido en el selector
  const [error, setError] = useState(''); // último error, si hubo
  const [sending, setSending] = useState(false); // true mientras viaja el texto
  const [sendingOffer, setSendingOffer] = useState(false); // true mientras viaja la oferta
  const endRef = useRef<HTMLDivElement>(null); // ancla al final de la lista para hacer scroll

  // el return del efecto es la desuscripción que devuelve onValue
  useEffect(() => listenMessages(CHAT_ID, setMessages), []); // se suscribe al montar y corta al desmontar

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' }); // baja al último mensaje
  }, [messages]); // cada vez que cambia la lista

  async function handleSend(event: FormEvent) {
    event.preventDefault(); // evita que el form recargue la página
    if (!text.trim() || sending) return; // ignora envíos vacíos o dobles

    setSending(true); // bloquea el botón
    setError(''); // limpia el error anterior
    try {
      await sendTextMessage(CHAT_ID, text); // escribe en /chats/{chatId}/messages
      setText(''); // limpia el input recién cuando Firebase confirmó
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar el mensaje'); // muestra el motivo real
    } finally {
      setSending(false); // suelta el botón pase lo que pase
    }
  }

  async function handleOffer() {
    const product = findProduct(productId); // busca el servicio elegido en el catálogo
    if (!product) return; // si el id no existe, no hace nada

    setSendingOffer(true); // bloquea selector y botón
    setError(''); // limpia el error anterior
    try {
      await sendProductOffer(CHAT_ID, product); // publica product_offer en pending
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar la oferta'); // informa el fallo
    } finally {
      setSendingOffer(false); // libera los controles
    }
  }

  return (
    <div className="chat">
      <div className="chat__shell">
        <header className="chat__header">
          <div className="chat__identity">
            <div className="chat__avatar">E</div> {/* inicial de Esmassiva */}
            <div>
              <h1 className="chat__title">Esmassiva</h1> {/* nombre del comercio */}
              <p className="chat__subtitle">
                chat {CHAT_ID} · {messages.length} mensajes
              </p>
            </div>
          </div>

          <div className="chat__actions">
            <ProductPicker
              products={PRODUCTS} // opciones del catálogo
              value={productId} // servicio seleccionado
              onChange={setProductId} // guarda la elección
              disabled={sendingOffer} // se bloquea mientras la oferta viaja
            />

            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleOffer}
              disabled={sendingOffer} // sin doble clic
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
              <ProductOfferCard key={message.id} message={message} /> // las ofertas van con tarjeta
            ) : (
              <MessageBubble key={message.id} message={message} /> // el resto, como burbuja
            ),
          )}

          <div ref={endRef} /> {/* ancla del scroll */}
        </section>

        {error && <p className="chat__error">{error}</p>} {/* solo si hay error */}

        <form className="composer" onSubmit={handleSend}>
          <input
            className="composer__input"
            value={text}
            onChange={(event) => setText(event.target.value)} // input controlado
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
