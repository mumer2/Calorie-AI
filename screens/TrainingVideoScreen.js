// screens/TrainingVideoScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function TrainingVideoScreen({ route }) {
  const { title, videoUrl } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>
      <WebView source={{ uri: videoUrl }} style={styles.video} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f8ff' },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0e4d92',
    textAlign: 'center',
    padding: 10,
  },
  video: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
