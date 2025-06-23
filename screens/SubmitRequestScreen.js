import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
} from 'react-native';

export default function SubmitRequestScreen({ navigation, isAdmin }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const userId = 'user123'; // Replace this dynamically if needed

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
            userId,
            type: 'mealPlan',
            content,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert('✅ Submitted', 'Your plan has been sent for review.');
        setContent('');
        fetchUserRequests(); // refresh after submit
      } else {
        throw new Error(data.error || 'Something went wrong.');
      }
    } catch (err) {
      Alert.alert('❌ Error', err.message);
    }

    setLoading(false);
  };

  const fetchUserRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await fetch(
        `https://backend-calorieai.netlify.app/.netlify/functions/getUserRequests?userId=${userId}`
      );
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      Alert.alert('❌ Failed to fetch requests', err.message);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchUserRequests();
  }, []);

  const renderRequest = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.planText}>{item.content}</Text>
      <Text style={styles.status}>
        🟢 {item.status?.toUpperCase() || 'PENDING'}
      </Text>
      <Text style={styles.date}>
        📅 {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

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

      <Text style={styles.sectionTitle}>📋 My Submitted Plans</Text>

      {loadingRequests ? (
        <ActivityIndicator size="small" color="#555" />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          renderItem={renderRequest}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 10, color: '#888' }}>
              No submitted plans yet.
            </Text>
          }
        />
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
  sectionTitle: {
    fontSize: 18,
    marginTop: 30,
    marginBottom: 10,
    fontWeight: '600',
    color: '#555',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  planText: {
    fontSize: 15,
    marginBottom: 6,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007B00',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
});
