import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CHAT_ID } from '../../config/firebase';
import { createOrder } from '../../orders/services/orders.service';
import MessageBubble from '../components/MessageBubble';
import ProductOfferCard from '../components/ProductOfferCard';
import {
  listenMessages,
  sendOrderAccepted,
  sendTextMessage,
  updateOfferStatus,
} from '../services/chat.service';
import type { ChatMessage } from '../interfaces/chat-message.interface';

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [answering, setAnswering] = useState<string | null>(null);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => listenMessages(CHAT_ID, setMessages), []);

  async function handleSend() {
    if (!text.trim() || answering) return;

    setError('');
    try {
      await sendTextMessage(CHAT_ID, text);
      setText('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar el mensaje');
    }
  }

  async function handleAnswer(message: ChatMessage, accepted: boolean) {
    // anti doble respuesta: si ya no está pendiente, no hacemos nada
    if (message.status !== 'pending' || answering) return;

    setAnswering(message.id);
    setError('');

    try {
      if (accepted) {
        // primero la API: si falla, la oferta queda pendiente y se puede reintentar
        await createOrder({
          chatId: CHAT_ID,
          messageId: message.id,
          product: message.product!,
        });
      }

      await updateOfferStatus(CHAT_ID, message.id, accepted ? 'accepted' : 'rejected');

      if (accepted) {
        await sendOrderAccepted(CHAT_ID, `Pedido confirmado: ${message.product?.name}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo responder la oferta');
    } finally {
      setAnswering(null);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Cliente — chat {CHAT_ID}</Text>
        <Text style={styles.subtitle}>{messages.length} mensajes</Text>
      </View>

      <FlatList
        ref={listRef}
        style={styles.list}
        data={messages}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={<Text style={styles.empty}>Todavía no hay mensajes.</Text>}
        renderItem={({ item }) =>
          item.type === 'product_offer' ? (
            <ProductOfferCard
              message={item}
              answering={answering === item.id}
              onAnswer={(accepted) => void handleAnswer(item, accepted)}
            />
          ) : (
            <MessageBubble message={item} />
          )
        }
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => void handleSend()}
          placeholder="Escribí un mensaje..."
          returnKeyType="send"
        />
        <Pressable style={styles.send} onPress={() => void handleSend()}>
          {answering ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendText}>Enviar</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff', paddingTop: 48 },
  header: { paddingHorizontal: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#d1d5db' },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 12, color: '#6b7280' },
  list: { flex: 1, paddingHorizontal: 16 },
  empty: { textAlign: 'center', color: '#9ca3af', marginTop: 24 },
  error: { color: '#b91c1c', paddingHorizontal: 16, paddingVertical: 4 },
  form: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  send: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 88,
  },
  sendText: { color: '#fff', fontWeight: '700' },
});
