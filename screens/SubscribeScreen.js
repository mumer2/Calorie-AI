import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SubscribeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient colors={['#e6f0ff', '#f8fcff']} style={styles.gradient}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.title}>✨ Choose Your Subscription</Text>

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate('SubwithCoins')}
        >
          <Text style={styles.buttonText}>Subscribe with Coins 🪙</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonWeChat}
          onPress={() => navigation.navigate('WeChatPay')}
        >
          <Text style={styles.buttonText}>Subscribe with WeChat Pay 💳</Text>
        </TouchableOpacity>
      </Animated.View>
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
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0e4d92',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonPrimary: {
    backgroundColor: '#0e4d92',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonWeChat: {
    backgroundColor: '#00c300',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
