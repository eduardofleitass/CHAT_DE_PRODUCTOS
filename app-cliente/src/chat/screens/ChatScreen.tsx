import { StyleSheet, Text, View } from 'react-native';
import { CHAT_ID } from '../../config/firebase';
import type { ChatMessage } from '../interfaces/chat-message.interface';

// FASE 3: lista (FlatList) + input + botón enviar + listener en tiempo real.
export default function ChatScreen() {
  const messages: ChatMessage[] = [];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cliente — chat {CHAT_ID}</Text>
      <Text>{messages.length} mensajes. Listener pendiente (fase 3).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
});
