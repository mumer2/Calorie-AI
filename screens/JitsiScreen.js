import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Linking, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';

export default function JitsiWebView() {
  const [hasPermissions, setHasPermissions] = useState(false);

  const url = `https://meet.jit.si/CalorieAI-Room123#config.disableDeepLinking=true&config.prejoinPageEnabled=false&userInfo.displayName="Umer Malik"`;

  // Ask camera & mic permission
  useEffect(() => {
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
  }, []);

  // Prevent redirect to intent:// or external links
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
  },
});
