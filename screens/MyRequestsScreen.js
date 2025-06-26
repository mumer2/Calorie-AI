import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_REQUESTS_URL = 'https://backend-calorieai.netlify.app/.netlify/functions/getUserRequests';

export default function MyRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await fetch(`${USER_REQUESTS_URL}?userId=${userId}`);
        const data = await response.json();
        if (response.ok) {
          setRequests(data);
        } else {
          Alert.alert('Error', 'Failed to load your requests');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Could not connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📤 Your Coach Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.message}>📝 {item.message}</Text>
            <Text style={styles.timestamp}>Sent: {new Date(item.timestamp).toLocaleString()}</Text>
            {item.reply ? (
              <>
                <Text style={styles.replyLabel}>💬 Coach's Reply:</Text>
                <Text style={styles.replyText}>{item.reply}</Text>
                {item.repliedAt && (
                  <Text style={styles.replyTime}>
                    Replied: {new Date(item.repliedAt).toLocaleString()}
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.pending}>⏳ Awaiting reply...</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f8ff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: {
    backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2,
  },
  message: { fontSize: 16, marginBottom: 6 },
  timestamp: { fontSize: 12, color: '#777' },
  replyLabel: { fontWeight: 'bold', marginTop: 10 },
  replyText: { backgroundColor: '#e6f0ff', padding: 10, borderRadius: 8, marginTop: 4 },
  replyTime: { fontSize: 12, color: '#777', marginTop: 4 },
  pending: { marginTop: 8, color: '#999' },
});
