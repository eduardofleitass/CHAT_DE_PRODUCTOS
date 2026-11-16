import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ChatMessage } from '../interfaces/chat-message.interface';
import { formatTime, initials } from '../format';
import { colors } from '../theme';

const STATUS_STYLE: Record<string, { color: string; background: string }> = {
  pending: { color: colors.warn, background: colors.warnSoft },
  accepted: { color: colors.ok, background: colors.okSoft },
  rejected: { color: colors.bad, background: colors.badSoft },
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
      <View style={styles.head}>
        {product?.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.img} />
        ) : (
          <View style={[styles.img, styles.mono]}>
            <Text style={styles.monoText}>{initials(product?.name ?? '')}</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {product?.name}
          </Text>

          {product?.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {product.description}
            </Text>
          ) : null}

          <Text style={styles.price}>
            {product?.price}
            <Text style={styles.currency}> {product?.currency}</Text>
            {product?.unit ? <Text style={styles.unit}> / {product.unit}</Text> : null}
          </Text>
        </View>
      </View>

      <View style={styles.foot}>
        <View style={[styles.pill, { backgroundColor: STATUS_STYLE[status].background }]}>
          <View style={[styles.dot, { backgroundColor: STATUS_STYLE[status].color }]} />
          <Text style={[styles.pillText, { color: STATUS_STYLE[status].color }]}>
            {STATUS_LABEL[status]}
          </Text>
        </View>

        <Text style={styles.time}>{formatTime(message.createdAt)}</Text>
      </View>

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
            <Text style={[styles.buttonText, styles.rejectText]}>Rechazar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'flex-end',
    width: '86%',
    padding: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    borderBottomRightRadius: 6,
  },
  head: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  img: { width: 56, height: 56, borderRadius: 12, backgroundColor: colors.bubble },
  mono: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accentSoft },
  monoText: { color: colors.accent, fontWeight: '700', fontSize: 14 },
  info: { flex: 1 },
  name: { fontSize: 14.5, fontWeight: '700', color: colors.text },
  description: { fontSize: 12.5, color: colors.muted, lineHeight: 17, marginTop: 2 },
  price: { fontSize: 15, fontWeight: '600', color: colors.text, marginTop: 6 },
  currency: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.4 },
  unit: { fontSize: 11, fontWeight: '600', color: colors.muted },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  pillText: { fontSize: 10.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  time: { fontSize: 10.5, color: colors.faint },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  button: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  accept: { backgroundColor: colors.ok },
  reject: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.bad },
  disabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 13.5 },
  rejectText: { color: colors.bad },
});
