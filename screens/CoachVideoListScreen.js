import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const COACHES_URL = 'https://backend-calorieai.netlify.app/.netlify/functions/get-coaches';

export default function CoachVideoScreen() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch(COACHES_URL);
        const data = await res.json();

        if (res.ok) {
          setCoaches(data);
        } else {
          Alert.alert('Error', data.message || 'Failed to load coaches.');
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch coach list.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  const joinSession = (coach) => {
    if (!coach || !coach._id) {
      Alert.alert('Error', 'Coach data is missing');
      return;
    }

    navigation.navigate('Jitsi', { coach });
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} color="#0e4d92" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎥 Select a Coach to Join Live Video</Text>

      <FlatList
        data={coaches}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => joinSession(item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No coaches available.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6fc',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#0e4d92',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e4d92',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  },
});
