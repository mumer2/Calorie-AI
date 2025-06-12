import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SubscribeScreen({ navigation }) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      const status = await AsyncStorage.getItem('isSubscribed');
      setIsSubscribed(status === 'true');
    };
    checkSubscription();
  }, []);

  const handleSubscribe = async () => {
    await AsyncStorage.setItem('isSubscribed', 'true');
    setIsSubscribed(true);
  };

  const goHome = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      {isSubscribed ? (
        <>
          <Text style={styles.title}>✅ You are already subscribed!</Text>
          <Text style={styles.desc}>Enjoy premium features 🎉</Text>
          <TouchableOpacity style={styles.button} onPress={goHome}>
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Unlock Premium Features 🎉</Text>
          <Text style={styles.desc}>Subscribe to access Daily Exercise & Diet Plan</Text>
          <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
            <Text style={styles.buttonText}>Subscribe Now - ₹199/month</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 10,
  },
  desc: {
    fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 30,
  },
  button: {
    backgroundColor: '#0e4d92', padding: 15, borderRadius: 10,
  },
  buttonText: {
    color: '#fff', fontWeight: 'bold',
  },
});
