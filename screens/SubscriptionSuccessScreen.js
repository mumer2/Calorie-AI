import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SubscriptionSuccessScreen({ route }) {
  const { method } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Subscription Successful!</Text>
      <Text style={styles.message}>
        You subscribed using {method === 'wechat' ? 'WeChat Pay' : 'Coins'}.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eef6fb' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0e4d92', marginBottom: 10 },
  message: { fontSize: 18, color: '#333' },
});
