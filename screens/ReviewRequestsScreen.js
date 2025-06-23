import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

export default function ReviewRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://backend-calorieai.netlify.app/.netlify/functions/getPending');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch requests');
    }
    setLoading(false);
  };

  const handleAction = async (id, status) => {
    try {
      await fetch('https://backend-calorieai.netlify.app/.netlify/functions/updateRequest', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status,
          reviewedBy: 'admin123', // Static for now; ideally use logged-in admin name
        }),
      });

      fetchRequests();
    } catch (err) {
      Alert.alert('Error', 'Failed to update request');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0e4d92" />
      </View>
    );
  }

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.content}>{item.content}</Text>
          <View style={styles.actions}>
            <Button
              title="Approve"
              onPress={() => handleAction(item._id, 'approved')}
            />
            <Button
              title="Reject"
              color="red"
              onPress={() => handleAction(item._id, 'rejected')}
            />
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#eee',
    padding: 16,
    margin: 12,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
});
