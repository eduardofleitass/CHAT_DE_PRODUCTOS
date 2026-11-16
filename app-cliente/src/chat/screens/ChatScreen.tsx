import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
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
import { colors } from '../theme';

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
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>C</Text>
        </View>
        <View style={styles.identity}>
          <Text style={styles.title}>Cliente</Text>
          <Text style={styles.subtitle}>
            chat {CHAT_ID} · {messages.length} mensajes
          </Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={messages}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Todavía no hay mensajes.{'\n'}Cuando el comercio mande una oferta, aparece acá.
          </Text>
        }
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

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => void handleSend()}
          placeholder="Escribí un mensaje..."
          placeholderTextColor={colors.faint}
          returnKeyType="send"
        />
        <Pressable
          style={({ pressed }) => [styles.send, (pressed || answering) && styles.sendPressed]}
          onPress={() => void handleSend()}
        >
          <Text style={styles.sendText}>Enviar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surface, paddingTop: 48 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.accent, fontWeight: '700', fontSize: 13 },
  identity: { flex: 1 },
  title: { fontSize: 15.5, fontWeight: '700', color: colors.text, letterSpacing: -0.2 },
  subtitle: { fontSize: 12.5, color: colors.muted, marginTop: 2 },
  list: { flex: 1, backgroundColor: colors.panel },
  listContent: { padding: 16, gap: 10, flexGrow: 1 },
  empty: {
    marginTop: 'auto',
    marginBottom: 'auto',
    textAlign: 'center',
    color: colors.faint,
    fontSize: 14,
    lineHeight: 21,
  },
  error: { color: colors.bad, fontSize: 13, paddingHorizontal: 20, paddingTop: 8 },
  composer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 22,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 18,
    fontSize: 14.5,
    color: colors.text,
    backgroundColor: '#f8f9fb',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
  },
  send: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendPressed: { backgroundColor: '#4338ca' },
  sendText: { color: '#fff', fontWeight: '700', fontSize: 13.5 },
});
