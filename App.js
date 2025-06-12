// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import FitnessScreen from './screens/FitnessScreen';
import DietPlanScreen from './screens/DietPlanScreen';
import ExerciseScreen from './screens/ExerciseScreen';
import SubscribeScreen from './screens/SubscribeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user name from AsyncStorage
  const loadName = async () => {
    const storedName = await AsyncStorage.getItem('userName');
    setName(storedName);
    setLoading(false);
  };

  useEffect(() => {
    loadName();

    // Refresh name every second (so Home updates if reset)
    const interval = setInterval(loadName, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} name={name} />}
        </Stack.Screen>
        <Stack.Screen name="Fitness" component={FitnessScreen} />
        <Stack.Screen name="Diet" component={DietPlanScreen} />
        <Stack.Screen name="Exercise" component={ExerciseScreen} />
        <Stack.Screen name="Subscribe" component={SubscribeScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
