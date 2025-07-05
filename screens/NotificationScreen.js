import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Vibration,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Audio } from 'expo-av';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const playNotificationSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/Notification.mp3')
      );
      await sound.playAsync();
    } catch (err) {
      console.warn('Error playing sound:', err.message);
    }
  };

  const fetchNotifications = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const res = await fetch(
        `https://backend-calorieai.netlify.app/.netlify/functions/get-user-notifications?userId=${userId}`
      );

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format');
      }

      const data = await res.json();

      if (res.ok) {
        setNotifications(data);

        const unread = data.filter((n) => !n.isRead).length;
        await AsyncStorage.setItem('unreadCount', unread.toString());

        if (unread > 0) playNotificationSound();
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await fetch(
        'https://backend-calorieai.netlify.app/.netlify/functions/mark-as-read',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        }
      );

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, isRead: true } : item
          )
        );

      const updated = notifications.map((item) =>
  item._id === id ? { ...item, isRead: true } : item
);
setNotifications(updated);

const updatedUnread = updated.filter((n) => !n.isRead).length;
await AsyncStorage.setItem('unreadCount', updatedUnread.toString());

      }
    } catch (e) {
      console.warn('Error marking notification as read:', e.message);
    }
  };

  const handleOpenNotification = async (item) => {
    await markAsRead(item._id);
    Vibration.vibrate(100);
    if (item?.data?.screen === 'CoachProfile') {
      navigation.navigate('CoachProfile');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const refreshOnFocus = async () => {
        setLoading(true);
        await fetchNotifications();
        await AsyncStorage.setItem('unreadCount', '0');
      };
      refreshOnFocus();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Notifications</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0e4d92" />
      ) : notifications.length === 0 ? (
        <Text style={styles.empty}>No notifications found.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleOpenNotification(item)}
              style={[
                styles.card,
                !item.isRead && {
                  borderLeftColor: '#0e4d92',
                  borderLeftWidth: 4,
                },
              ]}
            >
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.bodyText}>{item.body}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f9ff',
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
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  titleText: {
    fontWeight: 'bold',
    color: '#0e4d92',
    fontSize: 16,
  },
  bodyText: {
    marginTop: 4,
    fontSize: 14,
    color: '#444',
  },
  timestamp: {
    fontSize: 12,
    color: '#777',
    marginTop: 8,
    textAlign: 'right',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});
