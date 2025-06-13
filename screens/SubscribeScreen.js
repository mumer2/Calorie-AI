import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
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

      const response = await fetch('http://192.168.0.3:3000/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 19900, currency: 'inr', payment_method: 'alipay' }),
      });

      const data = await response.json();

      if (!data || !data.client_secret || !data.url) {
        throw new Error('Invalid response from server');
      }

      const result = await WebBrowser.openBrowserAsync(data.url);

      if (result.type === 'opened') {
        Alert.alert('Payment Initiated', 'Complete the payment in the Alipay page.');
        await AsyncStorage.setItem('isSubscribed', 'true');
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Payment Failed', 'Something went wrong. Please try again.');
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
              Get daily workouts & diet plans tailored for you.
            </Text>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Subscribe - ₹199 via Alipay</Text>
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
