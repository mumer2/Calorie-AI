import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function VideoSessionScreen() {
  const [roomURL, setRoomURL] = useState(null);
  const [error, setError] = useState(null);

  const fetchToken = async () => {
    try {
      // Make sure this endpoint works in your browser first
      const response = await fetch(
        'https://calorie-ai-backend.up.railway.app/livekit-token?room=groupRoom&identity=umer'
      );

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.token) {
        throw new Error('No token received from backend');
      }

      // ✅ Update the room URL to your LiveKit UI deployed link
      const room = `https://livekit-ui-123y-git-main-mumer2s-projects.vercel.app/room/groupRoom?token=${data.token}`;

      setRoomURL(room);
    } catch (err) {
      console.error('❌ Token fetch failed:', err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: 'red', textAlign: 'center', padding: 20 }}>
          Error: {error}
        </Text>
      </View>
    );
  }

  if (!roomURL) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0e4d92" />
        <Text style={{ marginTop: 10 }}>Connecting to Live Session...</Text>
      </View>
    );
  }

  return <WebView source={{ uri: roomURL }} style={{ flex: 1 }} />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
