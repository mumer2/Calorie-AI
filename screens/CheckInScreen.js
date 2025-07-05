import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CheckInScreen() {
  const [note, setNote] = useState('');

  const handleSubmit = async () => {
    if (!note.trim()) {
      Alert.alert('Please enter something for your check-in.');
      return;
    }

    const date = new Date().toDateString();
    const entry = {
      date,
      note,
      timestamp: Date.now(),
    };

    try {
      const stored = await AsyncStorage.getItem('checkins');
      const parsed = stored ? JSON.parse(stored) : [];
      parsed.unshift(entry); // add newest on top
      await AsyncStorage.setItem('checkins', JSON.stringify(parsed));

      Alert.alert('✅ Check-in saved!');
      setNote('');
    } catch (err) {
      Alert.alert('❌ Failed to save check-in.');
      console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.box}>
        <Text style={styles.title}>📝 Daily Check-In</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="How was your workout or day?"
          style={styles.input}
          multiline
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Save Check-In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f8ff', padding: 20, justifyContent: 'center' },
  box: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 4 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 14, color: '#0e4d92' },
  input: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0e4d92',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
``