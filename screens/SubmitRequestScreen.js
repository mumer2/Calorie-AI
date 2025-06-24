import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getUserId } from '../utils/userId'; // Adjust path if needed

export default function SubmitRequestScreen({ navigation, isAdmin }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchIdAndRequests = async () => {
      const id = await getUserId();
      setUserId(id);
      if (id) {
        fetchUserRequests(id);
      }
    };
    fetchIdAndRequests();
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('⚠️ Required', 'Please enter your plan details.');
      return;
    }

    if (!userId) {
      Alert.alert('❌ Error', 'User ID not available.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'https://backend-calorieai.netlify.app/.netlify/functions/submitRequest',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, type: 'mealPlan', content }),
        }
      );

      const data = await response.json();
      // 🛑 Check for daily submission limit
    if (response.status === 409) {
      Alert.alert('⛔ Limit Reached', data.error); // "You can only submit one request per day."
      setLoading(false);
      return;
    }
      if (response.ok) {
        Alert.alert('✅ Submitted', 'Your plan has been sent for review.');
        setContent('');
        fetchUserRequests(userId);
      } else {
        throw new Error(data.error || 'Something went wrong.');
      }
    } catch (err) {
      Alert.alert('❌ Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
  Alert.alert('Delete All Plans', 'Are you sure you want to delete all plans?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete All',
      style: 'destructive',
      onPress: async () => {
        try {
          setLoading(true);
          const res = await fetch(
            'https://backend-calorieai.netlify.app/.netlify/functions/deleteAllRequests',
            {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId }),
            }
          );
          const data = await res.json();
          if (res.ok) {
            Alert.alert('🗑 Cleared', 'All your plans were deleted.');
            fetchUserRequests();
          } else {
            throw new Error(data.error || 'Delete all failed');
          }
        } catch (err) {
          Alert.alert('❌ Error', err.message);
        } finally {
          setLoading(false);
        }
      },
    },
  ]);
};
  // Function to handle individual plan deletion

  const handleDelete = async (id) => {
    Alert.alert('Delete Plan', 'Are you sure you want to delete this plan?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            const res = await fetch(
              'https://backend-calorieai.netlify.app/.netlify/functions/deleteRequest',
              {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
              }
            );
            const data = await res.json();
            if (res.ok) {
              Alert.alert('🗑 Deleted', 'Plan deleted successfully.');
              fetchUserRequests(userId);
            } else {
              throw new Error(data.error || 'Delete failed');
            }
          } catch (err) {
            Alert.alert('❌ Error', err.message);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const fetchUserRequests = async (id) => {
    try {
      setLoadingRequests(true);
      const res = await fetch(
        `https://backend-calorieai.netlify.app/.netlify/functions/getUserRequests?userId=${id}`
      );
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      Alert.alert('❌ Failed to fetch requests', err.message);
    } finally {
      setLoadingRequests(false);
    }
  };

  const renderRequest = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.planText}>{item.content}</Text>

      <View style={styles.statusRow}>
        <Text
          style={[
            styles.status,
            item.status === 'approved' && { color: 'green' },
            item.status === 'rejected' && { color: 'red' },
          ]}
        >
          {item.status?.toUpperCase() || 'PENDING'}
        </Text>

        {item.status === 'pending' && (
          <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <Icon name="delete" size={20} color="red" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.date}>
        📅 {new Date(item.createdAt).toLocaleString()}
      </Text>

      {item.status === 'approved' && item.answer && (
        <View style={styles.answerBox}>
          <Text style={styles.answerLabel}>Admin Reply:</Text>
          <Text style={styles.answerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submit Your Request</Text>

      <TextInput
        placeholder="Enter your plan details..."
        value={content}
        onChangeText={setContent}
        multiline
        style={styles.input}
        placeholderTextColor="#aaa"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}

      {isAdmin && (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate('ReviewRequests')}
        >
          <Text style={styles.adminButtonText}>Review Requests (Admin)</Text>
        </TouchableOpacity>
      )}

      <View style={styles.headerRow}>
  <Text style={styles.sectionTitle}>📋 My Submitted Plans</Text>
  <TouchableOpacity onPress={handleDeleteAll}>
    <Icon name="delete" size={24} color="red" />
  </TouchableOpacity>
</View>



      {loadingRequests ? (
        <ActivityIndicator size="small" color="#555" />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          renderItem={renderRequest}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No submitted plans yet.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  adminButton: {
    backgroundColor: '#444',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  planText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
  answerBox: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  answerLabel: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  answerText: {
    color: '#444',
    fontSize: 14,
  },
  headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
}
});
