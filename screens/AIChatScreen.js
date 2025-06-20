import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';

export default function AIChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await axios.post(
        'https://calorieai-backend.netlify.app/.netlify/functions/openai',
        { question: input }
      );

      const aiMessage = { role: 'assistant', content: res.data.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('❌ Chat API error:', err.message);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, failed to fetch answer.' },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Text
            style={[
              styles.message,
              item.role === 'user' ? styles.user : styles.ai,
            ]}
          >
            {item.role === 'user' ? 'You: ' : 'CoachBot: '}
            {item.content}
          </Text>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me about workouts, diet..."
          value={input}
          onChangeText={setInput}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 50,
  },
  message: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  user: {
    backgroundColor: '#e6f7ff',
    alignSelf: 'flex-end',
  },
  ai: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
    paddingHorizontal: 10,
  },
});
