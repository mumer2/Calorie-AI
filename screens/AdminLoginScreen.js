// ✅ screens/AdminLoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminLoginScreen({ navigation }) {
  const [code, setCode] = useState('');

  const handleLogin = async () => {
    if (code === '1234') {
      await AsyncStorage.setItem('isAdmin', 'true');
      Alert.alert('✅ Logged in', 'Welcome Admin!');
      navigation.navigate('ReviewRequest'); // or wherever your admin screen is
    } else {
      Alert.alert('❌ Invalid Code', 'Please try again');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Admin Code</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="Enter secret code"
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0e4d92',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
