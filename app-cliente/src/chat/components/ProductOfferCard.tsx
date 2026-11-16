import { StyleSheet, Text, View } from 'react-native';
import type { ChatMessage } from '../interfaces/chat-message.interface';

// FASE 3: si status === 'pending' muestra Aprobar/Rechazar (solo el cliente).
export default function ProductOfferCard({
  message,
  onAnswer,
}: {
  message: ChatMessage;
  onAnswer?: (accepted: boolean) => void;
}) {
  const p = message.product;
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{p?.name}</Text>
      <Text>
        {p?.price} {p?.currency}
      </Text>
      <Text>{message.status}</Text>
      {/* TODO fase 3: botones cuando pending; onAnswer?.(true | false) */}
      {onAnswer ? null : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 8, padding: 12, marginVertical: 6 },
  name: { fontWeight: 'bold' },
});
