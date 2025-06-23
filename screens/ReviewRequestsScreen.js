import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

export default function ReviewRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // holds the ID of request being updated

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        'https://backend-calorieai.netlify.app/.netlify/functions/getRequests'
      );
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      Alert.alert('❌ Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      setUpdating(id);
      const res = await fetch(
        'https://backend-calorieai.netlify.app/.netlify/functions/updateRequest',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Alert.alert(
          status === 'approved' ? '✅ Approved' : '❌ Rejected',
          `Request has been ${status}.`
        );
        fetchRequests();
      } else {
        throw new Error(data.error || 'Action failed');
      }
    } catch (err) {
      Alert.alert('❌ Error', err.message);
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.user}>👤 {item.userId}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.date}>📅 {new Date(item.createdAt).toLocaleString()}</Text>

      <View style={styles.actions}>
        <Button
          title="✅ Approve"
          onPress={() => handleAction(item._id, 'approved')}
          disabled={updating === item._id}
          color="#2e7d32"
        />
        <Button
          title="❌ Reject"
          onPress={() => handleAction(item._id, 'rejected')}
          disabled={updating === item._id}
          color="#d32f2f"
        />
      </View>

      {updating === item._id && (
        <ActivityIndicator size="small" color="#666" style={{ marginTop: 10 }} />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading requests...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 20 }}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={{ fontSize: 18, color: '#999' }}>No pending requests.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  user: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
    color: '#444',
  },
  content: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  empty: {
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
