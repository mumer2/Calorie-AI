import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WeChatPayScreen() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    fetch('https://backend-calorieai.netlify.app/.netlify/functions/wechat-pay', {
      method: 'POST',
      body: JSON.stringify({ total_fee: 100 }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.mweb_url) setUrl(data.mweb_url);
        else alert('Payment error: ' + (data.message || 'Unknown error'));
      })
      .catch((e) => alert('Error: ' + e.message));
  }, []);

  return url ? (
    <WebView source={{ uri: url }} style={{ flex: 1 }} />
  ) : (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#0e4d92" />
    </View>
  );
}
