import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SIGNUP_URL = 'https://backend-calorieai.netlify.app/.netlify/functions/signup';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return Alert.alert('Error', 'All fields are required');
    }

    try {
      const response = await fetch(SIGNUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userName', name.trim());
        Alert.alert('Success', 'Account created. Please login.');
        navigation.replace('Login');
      } else {
        Alert.alert('Signup Failed', data.message || 'Something went wrong. Try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.roleSwitch}>
          <TouchableOpacity onPress={() => setRole('member')}>
            <Text style={role === 'member' ? styles.selected : styles.unselected}>Member</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRole('coach')}>
            <Text style={role === 'coach' ? styles.selected : styles.unselected}>Coach</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6fb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0e4d92',
    textAlign: 'center',
    marginBottom: 20,
  },
  roleSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  selected: {
    color: '#0e4d92',
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 12,
    textDecorationLine: 'underline',
  },
  unselected: {
    color: '#888',
    fontSize: 16,
    marginHorizontal: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#0e4d92',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 16,
    color: '#0e4d92',
    textAlign: 'center',
    fontSize: 14,
  },
});
