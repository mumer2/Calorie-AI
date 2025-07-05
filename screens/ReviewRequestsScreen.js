import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const REQUESTS_URL = 'https://backend-calorieai.netlify.app/.netlify/functions/getCoachRequests';
const REPLY_URL = 'https://backend-calorieai.netlify.app/.netlify/functions/replyToRequest';

export default function ReviewRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, new, read
  const [sendingReplyId, setSendingReplyId] = useState(null); // Track current sending

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const coachId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${REQUESTS_URL}?coachId=${coachId}`);
      const data = await response.json();

      if (response.ok) {
        setRequests(data);
        applyFilter(filter, data);

        // Save unread count to AsyncStorage (used for tab badge)
        const unread = data.filter((item) => item.status !== 'read').length;
        await AsyncStorage.setItem('unreadCount', unread.toString());
      } else {
        Alert.alert('Error', data.message || 'Failed to load requests');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (filterType, sourceData = requests) => {
    setFilter(filterType);
    if (filterType === 'new') {
      setFilteredRequests(sourceData.filter((item) => item.status !== 'read'));
    } else if (filterType === 'read') {
      setFilteredRequests(sourceData.filter((item) => item.status === 'read'));
    } else {
      setFilteredRequests(sourceData);
    }
  };

  const sendReply = async (item) => {
    if (!item.tempReply || item.tempReply.trim() === '') {
      return Alert.alert('Error', 'Reply cannot be empty.');
    }

    try {
      setSendingReplyId(item._id);
      const response = await fetch(REPLY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: item._id,
          reply: item.tempReply.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Reply sent successfully',
        });

        const updated = requests.map((r) =>
          r._id === item._id
            ? {
                ...r,
                reply: item.tempReply.trim(),
                status: 'read',
                repliedAt: new Date().toISOString(),
              }
            : r
        );

        setRequests(updated);
        applyFilter(filter, updated);

        // Update unread count
        const unread = updated.filter((item) => item.status !== 'read').length;
        await AsyncStorage.setItem('unreadCount', unread.toString());
      } else {
        Alert.alert('Error', data.message || 'Failed to send reply.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not send reply.');
    } finally {
      setSendingReplyId(null);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} color="#0e4d92" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📥 Member Requests</Text>

      <View style={styles.filterRow}>
        {['all', 'new', 'read'].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => applyFilter(type)}
            style={[styles.filterButton, filter === type && styles.activeFilter]}
          >
            <Text style={filter === type ? styles.activeFilterText : styles.filterText}>
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              item.status !== 'read' && { borderLeftColor: '#0e4d92', borderLeftWidth: 4 },
            ]}
          >
            <Text style={styles.name}>From: {item.userName}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.timestamp}>
              Sent: {new Date(item.timestamp).toLocaleString()}
            </Text>

            {item.reply ? (
              <>
                <Text style={styles.replyLabel}>Coach Reply:</Text>
                <Text style={styles.replyText}>{item.reply}</Text>
              </>
            ) : (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.replyLabel}>Reply:</Text>
                <TextInput
                  style={styles.replyInput}
                  placeholder="Write your reply..."
                  multiline
                  onChangeText={(text) => {
                    item.tempReply = text;
                  }}
                />
                <TouchableOpacity
                  style={[
                    styles.replyButton,
                    sendingReplyId === item._id && { opacity: 0.7 },
                  ]}
                  onPress={() => sendReply(item)}
                  disabled={sendingReplyId === item._id}
                >
                  {sendingReplyId === item._id ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.replyButtonText}>Send Reply</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No requests found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  message: {
    color: '#444',
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },
  replyLabel: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#0e4d92',
  },
  replyText: {
    marginTop: 4,
    backgroundColor: '#e6f0ff',
    padding: 8,
    borderRadius: 6,
    color: '#333',
  },
  replyInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    minHeight: 60,
    fontSize: 14,
  },
  replyButton: {
    backgroundColor: '#0e4d92',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  replyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
  },
  activeFilter: {
    backgroundColor: '#0e4d92',
    borderColor: '#0e4d92',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
