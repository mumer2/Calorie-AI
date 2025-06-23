import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';

export default function SubmitRequestScreen({ navigation, isAdmin }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('⚠️ Required', 'Please enter your plan details.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'https://backend-calorieai.netlify.app/.netlify/functions/submitRequest',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'user123', // You can replace this with real user ID
            type: 'mealPlan',
            content,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert('✅ Submitted', 'Your plan has been sent for review.');
        setContent('');
      } else {
        throw new Error(data.error || 'Something went wrong.');
      }
    } catch (err) {
      Alert.alert('❌ Error', err.message);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submit Your Plan</Text>

      <TextInput
        placeholder="Enter plan details..."
        value={content}
        onChangeText={setContent}
        multiline
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button title="Submit" onPress={handleSubmit} />
      )}

      {isAdmin && (
        <View style={{ marginTop: 20 }}>
          <Button
            title="Review Requests (Admin)"
            onPress={() => navigation.navigate('ReviewRequests')}
            color="#444"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
});
