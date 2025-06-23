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

export default function AdminLoginScreen({ navigation, setIsAdmin }) {
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (password === 'admin123') {
      await AsyncStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
      Alert.alert('✅ Welcome!', 'Admin access granted');
      navigation.replace('SubmitRequest');
    } else {
      Alert.alert('❌ Access Denied', 'Incorrect admin password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Admin Password</Text>
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, marginTop: 40 },
  label: { fontSize: 18, marginBottom: 10 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});