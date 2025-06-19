import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function VideoSessionScreen() {
  const [roomURL, setRoomURL] = useState(null);
  const [error, setError] = useState(null);

  const fetchToken = async () => {
    try {
      const response = await fetch(
        'https://calorieai-backend.netlify.app/api/livekit-token?room=groupRoom&identity=umer'
      );

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.token) {
        throw new Error('No token received from backend');
      }

      const room = `https://livekit-ui-app.netlify.app/room/groupRoom?token=${data.token}`;
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

return (
  <WebView
    source={{ uri: roomURL }}
    startInLoadingState
    renderLoading={() => (
      <ActivityIndicator size="large" color="#0e4d92" style={{ marginTop: 50 }} />
    )}
    style={{ flex: 1 }}
  />
);

}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
