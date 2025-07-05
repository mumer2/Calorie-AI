import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Linking, Alert, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';

export default function JitsiScreen({ route }) {
  const [hasPermissions, setHasPermissions] = useState(false);
  const { coach } = route.params || {};

  useEffect(() => {
    if (!coach) {
      Alert.alert('❌ No coach selected.');
      return;
    }

    (async () => {
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
  }, [coach]);

  const handleNavigation = (event) => {
    const { url } = event;

    if (url.startsWith('intent://') || url.includes('external')) {
      return false;
    }

    if (!url.startsWith('https://meet.jit.si')) {
      Linking.openURL(url);
      return false;
    }

    return true;
  };

  // Build dynamic meeting URL using coach ID and name
  const displayName = coach?.name || 'Coach';
  const roomName = `CalorieAI-Coach-${coach?._id || 'Unknown'}`;
  const encodedName = encodeURIComponent(displayName);

  const url = `https://meet.jit.si/${roomName}#config.disableDeepLinking=true&config.prejoinPageEnabled=false&userInfo.displayName="${encodedName}"`;

  return (
    <View style={styles.container}>
      {hasPermissions && (
        <WebView
          source={{ uri: url }}
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
    marginTop: Platform.OS === 'android' ? 24 : 0, // Adjust for status bar on Android
  },
});
