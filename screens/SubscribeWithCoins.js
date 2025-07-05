import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const COIN_SUBSCRIBE_URL =
  'https://backend-calorieai.netlify.app/.netlify/functions/subscribe-with-coins';

export default function SubscribeWithCoins({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
  setLoading(true);
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      Alert.alert('Error', 'User ID not found.');
      return;
    }

    const res = await fetch(COIN_SUBSCRIBE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const text = await res.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error('Invalid server response: ' + text);
    }

    if (res.ok) {
      await AsyncStorage.setItem('isSubscribed', 'true');
      Alert.alert('🎉 Subscribed', 'You have successfully subscribed using 100 coins!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Home' }),
        },
      ]);
    } else {
      Alert.alert('Error', data.message || 'Subscription failed.');
    }
  } catch (err) {
    console.error(err);
    Alert.alert('Error', err.message || 'Network error.');
  } finally {
    setLoading(false);
  }
};

  return (
    <LinearGradient colors={['#e6f0ff', '#f4f8fb']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Use Coins to Subscribe</Text>
        <Text style={styles.subtitle}>
          Unlock premium features instantly by spending 100 coins.
        </Text>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Confirm Subscription</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          🔐 This subscription grants full access to diet plans, training guides, and more.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0e4d92',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#0e4d92',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  note: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
});
