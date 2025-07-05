import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CoachLiveScreen() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [coach, setCoach] = useState(null);

  useEffect(() => {
    (async () => {
      // Get logged-in coach's data from storage
      const userId = await AsyncStorage.getItem('userId');
      const userName = await AsyncStorage.getItem('userName');
      const userRole = await AsyncStorage.getItem('userRole');

      if (userRole !== 'coach') {
        Alert.alert('Access Denied', 'Only coaches can join this live session.');
        return;
      }

      if (!userId || !userName) {
        Alert.alert('Error', 'Coach info not found.');
        return;
      }

      setCoach({ _id: userId, name: userName });

      const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: micStatus } = await Audio.requestPermissionsAsync();

      if (camStatus === 'granted' && micStatus === 'granted') {
        setHasPermissions(true);
      } else {
        Alert.alert(
          'Permissions Required',
          'Camera and microphone access are needed to join the meeting.',
        );
      }
    })();
  }, []);

  const handleNavigation = (event) => {
    const { url } = event;

    if (url.startsWith('intent://') || url.includes('external')) return false;
    if (!url.startsWith('https://meet.jit.si')) {
      Linking.openURL(url);
      return false;
    }

    return true;
  };

  const roomName = coach ? `CalorieAI-Coach-${coach._id}` : '';
  const encodedName = encodeURIComponent(coach?.name || 'Coach');
  const jitsiUrl = `https://meet.jit.si/${roomName}#config.disableDeepLinking=true&config.prejoinPageEnabled=false&userInfo.displayName="${encodedName}"`;

  return (
    <View style={styles.container}>
      {hasPermissions && coach && (
        <WebView
          source={{ uri: jitsiUrl }}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={['*']}
          onShouldStartLoadWithRequest={handleNavigation}
          startInLoadingState
          cacheEnabled={false}
          allowsFullscreenVideo
          mixedContentMode="always"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    marginTop: Platform.OS === 'android' ? 24 : 0,
  },
});
