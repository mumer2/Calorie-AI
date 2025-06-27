import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RedeemScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎁 Redeem Rewards</Text>
      <Text style={styles.message}>Reward redemption coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6fb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#555',
  },
});
