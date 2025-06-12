import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserName = async () => await AsyncStorage.getItem('userName');
export const setUserName = async (name) => await AsyncStorage.setItem('userName', name);
export const clearUserName = async () => await AsyncStorage.removeItem('userName');