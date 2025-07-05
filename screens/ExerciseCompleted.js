import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function ExerciseCompleted() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/success.png')} style={styles.image} />
      <Text style={styles.title}>🎉 Great Job!</Text>
      <Text style={styles.subtitle}>You’ve completed your leg workout.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e6f2ff', alignItems: 'center', justifyContent: 'center', padding: 20 },
  image: { width: 180, height: 180, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0e4d92', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#444', textAlign: 'center' },
});
