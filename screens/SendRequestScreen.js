// 3️⃣ SendRequestScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function SendRequestScreen({ route, navigation }) {
  const { coachId } = route.params;
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return Alert.alert('Message is required');

    // Example POST request (update endpoint as needed)
    fetch('https://backend-calorieai.netlify.app/.netlify/functions/send-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coachId, message })
    })
      .then(res => res.json())
      .then(data => {
        Alert.alert('✅ Request Sent', 'Your request has been sent to the coach.');
        navigation.goBack();
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Something went wrong');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send a Request</Text>
      <TextInput
        multiline
        placeholder="Type your message to coach..."
        style={styles.input}
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#0e4d92' },
  input: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9'
  },
  button: {
    backgroundColor: '#0e4d92',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});