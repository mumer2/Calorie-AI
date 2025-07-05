// 1️⃣ CoachListScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator
} from 'react-native';

export default function CoachListScreen({ navigation }) {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://backend-calorieai.netlify.app/.netlify/functions/get-coaches')
      .then(res => res.json())
      .then(data => {
        setCoaches(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const renderCoach = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CoachProfile', { coach: item })}
    >
      <Text style={styles.name}>{item.name}</Text>
      {/* <Text style={styles.specialty}>{item.specialty}</Text> */}
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Coaches</Text>
      <FlatList
        data={coaches}
        keyExtractor={(item) => item._id}
        renderItem={renderCoach}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#eef6fb' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20,textAlign: 'center', color: '#0e4d92' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#0e4d92' },
  specialty: { color: '#555' },
});