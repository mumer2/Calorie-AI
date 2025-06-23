import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';

export default function ReviewRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminAnswer, setAdminAnswer] = useState('');

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

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setAdminAnswer('');
    setModalVisible(true);
  };

  const submitApproval = async () => {
    try {
      setUpdating(selectedRequest._id);
      const res = await fetch(
        'https://backend-calorieai.netlify.app/.netlify/functions/updateRequest',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedRequest._id,
            status: 'approved',
            answer: adminAnswer,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Alert.alert('✅ Approved', 'Request has been approved.');
        fetchRequests();
      } else {
        throw new Error(data.error || 'Action failed');
      }
    } catch (err) {
      Alert.alert('❌ Error', err.message);
    } finally {
      setUpdating(null);
      setModalVisible(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setUpdating(id);
      const res = await fetch(
        'https://backend-calorieai.netlify.app/.netlify/functions/updateRequest',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: 'rejected' }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Alert.alert('❌ Rejected', 'Request has been rejected.');
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
      {item.answer && (
        <Text style={styles.answer}>💬 Admin: {item.answer}</Text>
      )}

      <View style={styles.actions}>
        <Button
          title="✅ Approve"
          onPress={() => handleApprove(item)}
          disabled={updating === item._id}
          color="#2e7d32"
        />
        <Button
          title="❌ Reject"
          onPress={() => handleReject(item._id)}
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
    <>
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

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Enter response:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Add a comment or answer..."
              multiline
              value={adminAnswer}
              onChangeText={setAdminAnswer}
            />
            <Button title="Submit Approval" onPress={submitApproval} color="#2e7d32" />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="#999" />
          </View>
        </View>
      </Modal>
    </>
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
  answer: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#005eaa',
    marginTop: 6,
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  empty: {
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    height: 100,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
});
