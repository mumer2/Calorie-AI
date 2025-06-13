import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen({ navigation }) {
  const [name, setName] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ⏳ Skip onboarding if name already exists
  useEffect(() => {
    const checkName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        navigation.replace('MainTabs'); // ✅ navigate to MainTabs instead of Home
      }
    };
    checkName();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // ✅ Save name and navigate to MainTabs
  const handleNext = async () => {
    const trimmedName = name.trim();
    if (trimmedName) {
      await AsyncStorage.setItem('userName', trimmedName);
      navigation.replace('MainTabs');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View style={{ ...styles.innerContainer, opacity: fadeAnim }}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png' }}
          style={styles.image}
        />
        <Text style={styles.title}>Welcome to Calorie AI</Text>
        <Text style={styles.subtitle}>Let's start your fitness journey</Text>

        <TextInput
          placeholder="What's your name?"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.button, { opacity: name.trim() ? 1 : 0.5 }]}
          onPress={handleNext}
          disabled={!name.trim()}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f8ff' },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: { width: 150, height: 150, marginBottom: 30 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0e4d92',
  },
  subtitle: { fontSize: 16, color: '#444', marginBottom: 30 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#0e4d92',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
