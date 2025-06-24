import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';

export default function SubscribeScreen({ navigation }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      const status = await AsyncStorage.getItem('isSubscribed');
      setIsSubscribed(status === 'true');
    };
    checkSubscription();
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        'https://backend-calorieai.netlify.app/.netlify/functions/payment',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 19900, // ¥199.00 in cents
            currency: 'cny', // Alipay supports cny or hkd
          }),
        }
      );

      const data = await response.json();
      console.log('Stripe response:', data);

    if (!data || !data.nextActionUrl) {
  throw new Error('Invalid response from server');
}

const result = await WebBrowser.openBrowserAsync(data.nextActionUrl);

      if (result.type === 'dismiss') {
        // Browser closed — assume payment is complete
        await AsyncStorage.setItem('isSubscribed', 'true');
        setIsSubscribed(true);
        Alert.alert('Payment Complete', 'Thank you for subscribing!');
        navigation.replace('Home');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Failed', error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {isSubscribed ? (
          <>
            <Text style={styles.title}>🎉 You’re Subscribed!</Text>
            <Text style={styles.subtitle}>Premium features unlocked.</Text>
            <TouchableOpacity style={styles.button} onPress={goHome}>
              <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Unlock Premium Access</Text>
            <Text style={styles.subtitle}>
             Enjoy expert-designed workout routines and custom diet guidance.
            </Text>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Subscribe - ¥199 via Alipay</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6ff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0e4d92',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#0e4d92',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
