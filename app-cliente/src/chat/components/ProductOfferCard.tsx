import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ChatMessage } from '../interfaces/chat-message.interface';

const STATUS_COLOR: Record<string, string> = {
  pending: '#b45309',
  accepted: '#15803d',
  rejected: '#b91c1c',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'pendiente',
  accepted: 'aceptada',
  rejected: 'rechazada',
};

export default function ProductOfferCard({
  message,
  onAnswer,
  answering,
}: {
  message: ChatMessage;
  onAnswer: (accepted: boolean) => void;
  answering: boolean;
}) {
  const product = message.product;
  const status = message.status ?? 'pending';
  // solo el cliente responde, y solo mientras siga pendiente
  const canAnswer = status === 'pending' && !answering;

  return (
    <View style={styles.card}>
      {product?.imageUrl ? <Image source={{ uri: product.imageUrl }} style={styles.img} /> : null}

      <View style={styles.body}>
        <Text style={styles.name}>{product?.name}</Text>
        <Text style={styles.price}>
          {product?.price} {product?.currency}
        </Text>
        <Text style={[styles.status, { color: STATUS_COLOR[status] }]}>
          oferta {STATUS_LABEL[status]}
        </Text>

        {status === 'pending' && (
          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.accept, !canAnswer && styles.disabled]}
              disabled={!canAnswer}
              onPress={() => onAnswer(true)}
            >
              <Text style={styles.buttonText}>Aprobar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.reject, !canAnswer && styles.disabled]}
              disabled={!canAnswer}
              onPress={() => onAnswer(false)}
            >
              <Text style={styles.buttonText}>Rechazar</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
  },
  img: { width: 56, height: 56, borderRadius: 8 },
  body: { flex: 1 },
  name: { fontWeight: '700', fontSize: 15 },
  price: { color: '#374151' },
  status: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  button: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  accept: { backgroundColor: '#15803d' },
  reject: { backgroundColor: '#b91c1c' },
  disabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
