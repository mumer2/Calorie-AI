import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function CoachHomeScreen({ navigation }) {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [userName, setUserName] = useState('');

  useFocusEffect(
  useCallback(() => {
    const getName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName);
      }
    };
    getName();
  }, [])
);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('userName');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Row with Name & Settings */}
      <View style={styles.topBar}>
        <Text style={styles.nameText}>Hi, {userName}</Text>
        <TouchableOpacity onPress={() => setSettingsVisible(true)}>
          <Ionicons name="settings-outline" size={24} color="#0e4d92" />
        </TouchableOpacity>
      </View>

      {/* Dashboard Title */}
      <Text style={styles.dashboardTitle}>🏋️ Coach Dashboard</Text>

      {/* Settings Menu */}
      <Modal
        visible={settingsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setSettingsVisible(false)}>
          <View style={styles.settingsMenu}>
            <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
              <Ionicons name="log-out-outline" size={20} color="#b00020" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Action Cards */}
      <View style={styles.cardRow}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ReviewRequests')}
        >
          <Ionicons name="eye-outline" size={32} color="#0e4d92" />
          <Text style={styles.cardText}>Review Requests</Text>
        </TouchableOpacity>
         <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('CoachLiveScreen')}
        >
          <Ionicons name="camera" size={32} color="#0e4d92" />
          <Text style={styles.cardText}>Join Live Video</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f0f8ff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0e4d92',
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  cardText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#0e4d92',
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 30,
    paddingRight: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingsMenu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    width: 150,
    elevation: 4,
    marginTop:'50',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logoutText: {
    marginLeft: 10,
    color: '#b00020',
    fontWeight: 'bold',
  },
});
