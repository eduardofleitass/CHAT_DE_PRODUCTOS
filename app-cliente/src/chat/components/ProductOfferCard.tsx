import { Image, Pressable, StyleSheet, Text, View } from 'react-native'; // primitivas de React Native
import type { ChatMessage } from '../interfaces/chat-message.interface'; // forma del mensaje
import { formatTime, initials } from '../format'; // hora de la oferta y monograma
import { colors } from '../theme'; // misma paleta que la web

const STATUS_STYLE: Record<string, { color: string; background: string }> = {
  pending: { color: colors.warn, background: colors.warnSoft }, // ámbar: esperando respuesta
  accepted: { color: colors.ok, background: colors.okSoft }, // verde: pedido guardado
  rejected: { color: colors.bad, background: colors.badSoft }, // rojo: rechazada sin API
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'pendiente', // texto de la pill
  accepted: 'aceptada', // texto de la pill
  rejected: 'rechazada', // texto de la pill
};

export default function ProductOfferCard({
  message, // mensaje con el servicio
  onAnswer, // avisa al padre si se aprobó o rechazó
  answering, // true mientras la respuesta está en vuelo
}: {
  message: ChatMessage;
  onAnswer: (accepted: boolean) => void;
  answering: boolean;
}) {
  const product = message.product; // servicio ofrecido
  const status = message.status ?? 'pending'; // sin status explícito se asume pendiente
  // solo el cliente responde, y solo mientras siga pendiente
  const canAnswer = status === 'pending' && !answering; // habilita o apaga los botones

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        {/* logo del servicio, o monograma con las iniciales si no hay imagen */}
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

          {/* detalle corto del servicio, opcional */}
          {product?.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {product.description}
            </Text>
          ) : null}

          {/* precio unitario, moneda y periodicidad */}
          <Text style={styles.price}>
            {product?.price}
            <Text style={styles.currency}> {product?.currency}</Text>
            {product?.unit ? <Text style={styles.unit}> / {product.unit}</Text> : null}
          </Text>
        </View>
      </View>

      <View style={styles.foot}>
        {/* pill con el estado de la oferta: punto de color + texto */}
        <View style={[styles.pill, { backgroundColor: STATUS_STYLE[status].background }]}>
          <View style={[styles.dot, { backgroundColor: STATUS_STYLE[status].color }]} />
          <Text style={[styles.pillText, { color: STATUS_STYLE[status].color }]}>
            {STATUS_LABEL[status]}
          </Text>
        </View>

        {/* hora en que se hizo la oferta */}
        <Text style={styles.time}>{formatTime(message.createdAt)}</Text>
      </View>

      {/* los botones solo existen mientras la oferta sigue pendiente */}
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
    alignSelf: 'flex-end', // las ofertas entran por la derecha, como un mensaje propio
    width: '86%', // ocupa casi todo el ancho en pantalla chica
    padding: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    borderBottomRightRadius: 6, // cola visual del lado derecho
  },
  head: { flexDirection: 'row', gap: 12, alignItems: 'center' }, // logo a la izquierda, datos a la derecha
  img: { width: 56, height: 56, borderRadius: 12, backgroundColor: colors.bubble }, // logo o caja vacía
  mono: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accentSoft }, // fondo del monograma
  monoText: { color: colors.accent, fontWeight: '700', fontSize: 14 }, // iniciales del servicio
  info: { flex: 1 }, // ocupa el ancho restante
  name: { fontSize: 14.5, fontWeight: '700', color: colors.text }, // nombre del servicio
  description: { fontSize: 12.5, color: colors.muted, lineHeight: 17, marginTop: 2 }, // detalle corto
  price: { fontSize: 15, fontWeight: '600', color: colors.text, marginTop: 6 }, // precio unitario
  currency: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.4 }, // moneda en versalitas
  unit: { fontSize: 11, fontWeight: '600', color: colors.muted }, // "/ mes"
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }, // pill + hora
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  dot: { width: 6, height: 6, borderRadius: 3 }, // punto de color de la pill
  pillText: { fontSize: 10.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }, // estado
  time: { fontSize: 10.5, color: colors.faint }, // hora
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 }, // botones lado a lado
  button: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' }, // base de los dos botones
  accept: { backgroundColor: colors.ok }, // aprobar sólido en verde
  reject: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.bad }, // rechazar fantasma en rojo
  disabled: { opacity: 0.4 }, // se ve apagado mientras viaja la respuesta
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 13.5 }, // texto de Aprobar
  rejectText: { color: colors.bad }, // texto de Rechazar
});
