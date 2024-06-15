import { StatusBar } from 'expo-status-bar'
import { greeting } from '@sovoli/ui'
import { StyleSheet, View, Text } from 'react-native'

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{greeting}</Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
