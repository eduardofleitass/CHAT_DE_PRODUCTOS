import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import ChatScreen from './chat/screens/ChatScreen';
import { colors } from './chat/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <ChatScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // en el navegador el fondo gris enmarca la app; en el teléfono no se ve
    backgroundColor: Platform.OS === 'web' ? colors.bg : colors.surface,
  },
});
