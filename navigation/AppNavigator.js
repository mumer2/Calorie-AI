import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import FitnessScreen from '../screens/FitnessScreen';
import DietScreen from '../screens/DietScreen';
import ExerciseScreen from '../screens/ExerciseScreen';
import SubscribeScreen from '../screens/SubscribeScreen';
import LegExerciseScreen from '../screens/LegExerciseScreen';
import ExerciseCompleted from '../screens/ExerciseCompleted';
import TrainingDetailScreen from '../screens/TrainingDetailScreen';
import WeChatPayScreen from '../screens/WeChatPayScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Fitness" component={FitnessScreen} />
        <Stack.Screen name="Diet" component={DietScreen} />
        <Stack.Screen name="Exercise" component={ExerciseScreen} />
        <Stack.Screen name="Subscribe" component={SubscribeScreen} />
        <Stack.Screen name="WeChatPay" component={WeChatPayScreen} />


         <Stack.Screen name="LegExercise" component={LegExerciseScreen} options={{ title: 'Leg Workout' }} />
  <Stack.Screen name="ExerciseCompleted" component={ExerciseCompleted} options={{ headerShown: false }} />
     <Stack.Screen
                    name="TrainingDetail"
                    component={TrainingDetailScreen}
                    options={{ title: "Training Detail" }}
                  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}