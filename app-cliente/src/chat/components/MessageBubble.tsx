import { StyleSheet, Text, View } from 'react-native';
import type { ChatMessage } from '../interfaces/chat-message.interface';
import { formatTime } from '../format';
import { colors } from '../theme';

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const mine = message.sender === 'cliente';
  const notice = message.type === 'order_accepted';

  return (
    <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
      <View style={[styles.bubble, mine ? styles.mine : styles.theirs, notice && styles.notice]}>
        {!mine && <Text style={styles.author}>{message.sender}</Text>}

        <Text style={[styles.text, mine && styles.textMine, notice && styles.textNotice]}>
          {message.text ?? (notice ? 'Pedido confirmado' : message.type)}
        </Text>

        <Text style={[styles.time, mine && !notice && styles.timeMine]}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '76%',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 16,
  },
  mine: { backgroundColor: colors.accent, borderBottomRightRadius: 6 },
  theirs: { backgroundColor: colors.bubble, borderBottomLeftRadius: 6 },
  notice: { backgroundColor: colors.okSoft },
  author: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.faint,
    marginBottom: 3,
  },
  text: { fontSize: 14.5, lineHeight: 20, color: colors.text },
  textMine: { color: '#fff' },
  textNotice: { color: colors.ok, fontWeight: '600' },
  time: { fontSize: 10.5, color: colors.faint, marginTop: 4 },
  timeMine: { color: 'rgba(255,255,255,0.7)' },
});
