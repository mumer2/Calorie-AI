import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export const getUserId = async () => {
  try {
    let userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      userId = uuid.v4(); // This is React Native compatible
      await AsyncStorage.setItem('userId', userId);
    }
    return userId;
  } catch (err) {
    console.error('Failed to get or create userId:', err);
    return null;
  }
};
