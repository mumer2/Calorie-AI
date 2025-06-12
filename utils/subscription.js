import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkSubscription = async () => {
  const status = await AsyncStorage.getItem('isSubscribed');
  return status === 'true';
};