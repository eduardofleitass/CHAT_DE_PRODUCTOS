import { StyleSheet, Text, View } from 'react-native';
import type { ChatMessage } from '../interfaces/chat-message.interface';

// FASE 3: alinear a la derecha cuando sender === 'cliente'.
export default function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <View style={styles.row}>
      <Text>{message.text ?? message.type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginVertical: 4 },
});
