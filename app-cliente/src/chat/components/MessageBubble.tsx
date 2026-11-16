import { StyleSheet, Text, View } from 'react-native';
import type { ChatMessage } from '../interfaces/chat-message.interface';

const TYPE_LABEL: Record<ChatMessage['type'], string> = {
  text: '',
  product_offer: 'Oferta de producto',
  order_accepted: 'Pedido confirmado',
};

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const mine = message.sender === 'cliente';

  return (
    <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
      <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
        <Text style={[styles.sender, mine && styles.textLight]}>{message.sender}</Text>
        <Text style={mine ? styles.textLight : undefined}>
          {message.text ?? TYPE_LABEL[message.type]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginVertical: 4 },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '78%', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  mine: { backgroundColor: '#2563eb' },
  theirs: { backgroundColor: '#e5e7eb' },
  sender: { fontSize: 10, opacity: 0.7, marginBottom: 2, textTransform: 'uppercase' },
  textLight: { color: '#fff' },
});
